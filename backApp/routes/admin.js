var express = require('express');
var router = express.Router();
const Admin = require('../models/Admin')
const Instructor = require('../models/Instructor')
const CorporateTrainee = require('../models/CorporateTrainee')
const jwt = require("jsonwebtoken");
const { verifyAdmin } = require("../auth/jwt-auth");
const StudentCourses = require('../models/StudentCourses');
const Course = require('../models/Course');
const mongoose = require("mongoose");
const Contract = require('../models/Contract');
const Subtitle = require('../models/Subtitle');
const { requestCourse } = require('../controllers/studentController');
const Requests = require('../models/Requests');
const Refund = require('../models/Refund');
const Wallet = require('../models/Wallet');

/* GET admins listing. */
router.get('/', function (req, res) {
  res.send('respond with a resource');

});

//Admin Login
router.post("/login", async (req, res) => {
  const adminLogin = req.body
  await Admin.findOne({ username: adminLogin.username, password: adminLogin.password }, { password: 0 }).then(admin => {
    if (admin) {
      const payload = JSON.parse(JSON.stringify(admin))
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
      return res.json({ message: "Invalid username or password" })
    }
  })
})

//add admin
router.post('/addAdmin', verifyAdmin, async function (req, res) {
  var found = await Admin.findOne({ username: req.body.username })
  if (found) {
    return res.status(400).json({ message: "Admin username already exists" })
  }
  const add = new Admin({
    username: req.body.username,
    password: req.body.password
  })
  try {
    const newAdmin = await add.save()
    res.status(201).json(newAdmin)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
});

//add instructor
router.post('/addInstructor', verifyAdmin, async function (req, res) {
  var found = await Instructor.findOne({ username: req.body.username })
  if (found) {
    return res.status(400).json({ message: "Instructor username already exists" })
  }
  const add = new Instructor({
    username: req.body.username,
    password: req.body.password
  })
  try {
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
  var found = await CorporateTrainee.findOne({ username: req.body.username })
  if (found) {
    return res.status(400).json({ message: "Corporate Trainee username already exists" })
  }
  const add = new CorporateTrainee({
    username: req.body.username,
    password: req.body.password,
    corporation: req.body.corporation
  })
  try {
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
      const course = await Course.findById(req.body.courseId)
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
      const newTraineeCourse = await traineeCourse.save();
      res.status(200).json(newTraineeCourse)
    } else {
      res.status(400).json({ message: "Trainee already registered to this course" })
    }
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
});
// a promotion for specific courses, several courses or all courses
router.post('/defineDiscount', verifyInstructor, async function (req, res) {
  try {
    const courses= req.body.courses
    for (let i = 0; i < courses.lenght; i++) {
      var course =  await Course.findOne({ courseId: req.body.courseId })
      var result = await Course.findByIdAndUpdate(course._id, { $set: { discount: req.body.discount} }, { new: true }) 
    }
    res.status(200).json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

//view course requests from corporate trainees
router.get('/viewRequest', verifyAllUsers ,async function(req, res) {
  try {
    var results = await Requests.find({ courseId: { $in: req.body.courseId } }).populate({path: "courseId", select: {_id: 1, title: 1}}).populate({path: "traineeId", select: {_id: 1, name: 1}})
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