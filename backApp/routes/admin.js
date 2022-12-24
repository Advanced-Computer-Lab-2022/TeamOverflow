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
const { addAmountOwed, transfer } = require('../controllers/walletController');
const moment = require("moment");
const Trainee = require('../models/Trainee');
const Report = require('../models/Report');
const Followup = require('../models/ReportFollowup');

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
    var results = await Requests.paginate({}, { page: req.query.page, limit: 10, populate: ["courseId", { path: "traineeId", select: { _id: 1, name: 1, email: 1, corporation: 1 } }] })
    res.status(200).json(results)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }

});

//grant access for corporate-trainee to a course
router.post('/registerCourse', verifyAdmin, async function (req, res) {
  try {
    var request = await Requests.findById(req.body.requestId)
    if (!(await StudentCourses.findOne({ traineeId: request.traineeId, courseId: request.courseId }))) {
      const course = await Course.findById(request.courseId).populate("instructorId")
      const subtitles = await Subtitle.find({ courseId: request.courseId }, { _id: 1, exerciseId: 1, videoId: 1 })
      const itemIds = [course.examId?.toString(), course.videoId?.toString(), subtitles.map((sub) => [sub.exerciseId?.toString(), sub.videoId?.toString()])].flat().flat()
      var completion = {}
      for (let i = 0; i < itemIds.length; i++) {
        if (itemIds[i]) {
          completion[itemIds[i]] = false
        }
      }
      var courseSubtotal = course.discount && moment().isBefore(course.deadline) ? course.price * ((100 - course.discount) / 100) : course.price
      const traineeCourse = new StudentCourses({
        traineeId: request.traineeId,
        courseId: request.courseId,
        completion: completion
      });
      await addAmountOwed(course.instructorId.walletId, courseSubtotal, "USD")
      const newTraineeCourse = await traineeCourse.save();
      await request.delete();
      course.$inc("enrolled", 1)
      await course.save()
      await request.delete()
      res.status(200).json(newTraineeCourse)
    } else {
      res.status(400).json({ message: "Trainee already registered to this course" })
    }
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
});

//view refund requests from trainees
router.get('/viewRefunds', verifyAdmin, async function (req, res) {
  try {
    var results = await Refund.paginate({}, { page: req.query.page, limit: 10, populate: ["registrationId", { path: "instructorId", select: { _id: 1, name: 1, email: 1 } }] })
    res.status(200).json(results)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

//refund an amount to a trainee to their wallet
router.post('/refundTraniee', verifyAdmin, async function (req, res) {
  try {
    var refund = await Refund.findById(req.query.refundId).populate(["traineeId", "instructorId", "registrationId"])
    if (refund) {
      await transfer(refund.instructorId.walletId, refund.traineeId.walletId, refund.registrationId.amountPaid)
      await StudentCourses.findByIdAndDelete(refund.registrationId._id)
      await refund.delete()
      res.status(200).json({ message: "Refund fulfilled" })
    } else {
      res.status(403).json({ message: "Refund request does not exist" })
    }
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

//view users reported problems
router.get('/viewReports', verifyAdmin, async function (req, res) {
  try {
    const status = req.query.status || { $regex: ".*" }
    const type = req.query.type || { $regex: ".*" }
    var results = await Report.paginate({ status: status, type: type }, { page: req.query.page, limit: 10, populate: { path: "userId", select: { _id: 1, name: 1, email: 1 } } })
    res.status(200).json(results)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

//view one reported problem with followups
router.get('/viewFollowups', verifyAdmin, async function (req, res) {
  try {
    const status = req.query.status || { $regex: ".*" }
    const type = req.query.type || { $regex: ".*" }
    var reports = await Report.findById(req.query.reportId)
    var followups = await Followup.find({ reportId: req.query.reportId })
    res.status(200).json({ report: reports, followups: followups })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

//respond to a report
router.post('/respondReport', verifyAdmin, async function (req, res) {
  try {
    var result = await Report.findByIdAndUpdate(req.body.reportId, { $set: { status: req.body.status } }, {new: true})
    res.status(200).json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})



/* Functions */

module.exports = router;