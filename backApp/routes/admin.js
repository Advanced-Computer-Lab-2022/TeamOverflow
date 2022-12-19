var express = require('express');
var router = express.Router();
const Admin = require('../models/Admin')
const Instructor = require('../models/Instructor')
const CorporateTrainee = require('../models/CorporateTrainee')
const jwt = require("jsonwebtoken");
const { verifyAdmin } = require("../auth/jwt-auth");
const { verifyInstructor } = require("../auth/jwt-auth");
const { verifyAllUsers } = require("../auth/jwt-auth");
const StudentCourses = require('../models/StudentCourses');
const Course = require('../models/Course');
const mongoose = require("mongoose");
const Contract = require('../models/Contract');
const Subtitle = require('../models/Subtitle');
const { requestCourse } = require('../controllers/studentController');
const Requests = require('../models/Requests');
const Refund = require('../models/Refund');
const bcrypt = require("bcrypt");
const Wallet = require('../models/Wallet');
const {addAmountOwed} = require('../controllers/walletController');
const moment = require("moment");

/* GET admins listing. */
router.get('/', function (req, res) {
  res.send('respond with a resource');

});

//Admin Login
router.post("/login", async (req, res) => {
  try {
    const adminLogin = req.body
    await Admin.findOne({ username: adminLogin.username }).then(async (admin) => {
      if (admin && await bcrypt.compare(adminLogin.password, admin.password)) {
        const payload = admin.toJSON()
        jwt.sign(
          payload,
          process.env.JWT_SECRET,
          //{expiresIn: 86400},
          (err, token) => {
            if (err) return res.json({ message: err })
            return res.status(200).json({ message: "Success", payload: payload, token: "Admin " + token })
          }
        )
      } else {
        return res.status(400).json({ message: "Invalid username or password" })
      }
    })
  } catch (err) {
    return res.status(400).json({ message: err.message })
  }
})

//add admin
router.post('/addAdmin', verifyAdmin, async function (req, res) {
  try {
    var found = await Admin.findOne({ username: req.body.username })
    if (found) {
      return res.status(400).json({ message: "Admin username already exists" })
    }
    var hash = await bcrypt.hash(req.body.password, 10)
    const add = new Admin({
      username: req.body.username,
      password: hash
    })
    const newAdmin = await add.save()
    res.status(201).json(newAdmin)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
});

//add instructor
router.post('/addInstructor', verifyAdmin, async function (req, res) {
  try {
    var found = await Instructor.findOne({ username: req.body.username })
    if (found) {
      return res.status(400).json({ message: "Instructor username already exists" })
    }
    var wallet = await Wallet.create({})
    var hash = await bcrypt.hash(req.body.password, 10)
    const add = new Instructor({
      username: req.body.username,
      password: hash,
      email: req.body.email,
      walletId: wallet._id
    })
    const newInstructor = await add.save()
    res.status(201).json(newInstructor)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
});

router.post('/createContract', verifyAdmin, async function (req, res) {
  try {
    const add = Contract({
      title: req.body.title,
      instructorId: req.body.instructorId,
      terms: req.body.terms,
      percentageTaken: req.body.percentageTaken,
      status: "Pending",
    })
    const newContract = await add.save()
    res.status(201).json(newContract)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
});

//add corporate trainee
router.post('/addTrainee', verifyAdmin, async function (req, res) {
  try {
    var found = await CorporateTrainee.findOne({ username: req.body.username })
    if (found) {
      return res.status(400).json({ message: "Corporate Trainee username already exists" })
    }
    var hash = await bcrypt.hash(req.body.password, 10)
    const add = new CorporateTrainee({
      username: req.body.username,
      password: hash,
      email: req.body.email,
      corporation: req.body.corporation
    })
    const newCorporateTrainee = await add.save()
    res.status(201).json(newCorporateTrainee)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
});

//register corporate-trainee to a course
router.post('/registerCourse', verifyAdmin, async function (req, res) {
  try {
    if (!(await StudentCourses.findOne({ traineeId: req.body.traineeId, courseId: req.body.courseId }))) {
      const course = await Course.findById(req.body.courseId).populate("instructorId")
      const subtitles = await Subtitle.find({ courseId: req.body.courseId }, { _id: 1, exerciseId: 1, videoId: 1 })
      const itemIds = [course.examId?.toString(), course.videoId?.toString(), subtitles.map((sub) => [sub.exerciseId?.toString(), sub.videoId?.toString()])].flat().flat()
      var completion = {}
      for (let i = 0; i < itemIds.length; i++) {
        if (itemIds[i]) {
          completion[itemIds[i]] = false
        }
      }
      const traineeCourse = new StudentCourses({
        traineeId: req.body.traineeId,
        courseId: req.body.courseId,
        completion: completion
      });
      var courseSubtotal = course.discount && moment().isBefore(course.deadline) ? course.price * ((100 - course.discount)/100) : course.price
      await addAmountOwed(course.instructorId.walletId, courseSubtotal, "USD")
      const newTraineeCourse = await traineeCourse.save();
      course.$inc("enrolled", 1)
      await course.save()
      res.status(200).json(newTraineeCourse)
    } else {
      res.status(400).json({ message: "Trainee already registered to this course" })
    }
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
});

// a promotion for specific courses, several courses or all courses
router.post('/defineDiscount', verifyAdmin, async function (req, res) {
  try {
    const courses = req.body.courses
    for (let i = 0; i < courses.length; i++) {
      var result = await Course.findByIdAndUpdate(courses[i], { $set: { discount: req.body.discount, deadline: req.body.deadline } }, { new: true })
    }
    res.status(200).json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

//view course requests from corporate trainees
router.get('/viewRequest', verifyAdmin, async function (req, res) {
  try {
    var results = await Requests.find({}).populate([{ path: "courseId", select: { _id: 1, title: 1 } }, { path: "traineeId", select: { _id: 1, name: 1 } }])
    res.status(200).json(results)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }

})

//grant corporate trainees access to specific courses
router.post('/grandAccess', verifyInstructor, async function (req, res) {
  try {
    const noRequests = req.body.noRequests
    for (let i = 0; i < noRequests.lenght; i++) {
      var traniee =  await Requests.findOne({ traineeId: req.body.traineeId })
      var result = await Requests.findByIdAndUpdate(trainee._id, { $set: { status : req.body.status} }, { new: true }) 
    }
    res.status(200).json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})


//refund an amount to a trainee to their wallet
router.post('/refundTraniee', verifyInstructor, async function (req, res) {
  try{
    var wallet =  await Refund.findOne({ walletId: req.body.walletId })
    var refundAmount = await Refund.findOne({ walletId: req.body.walletId },{amount:1})
    var result = await Wallet.findByIdAndUpdate(wallet._id, { $inc: { balance : refundAmount } }, { new: true }) 
    res.status(200).json(result)
  }catch (err){
    res.status(400).json({ message: err.message })
  }
  
})




/* Functions */

module.exports = router;