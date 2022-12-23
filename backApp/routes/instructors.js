const { verifyInstructor } = require('../auth/jwt-auth');
var express = require('express');
var router = express.Router();
var Instructor = require("../models/Instructor");
var Course = require("../models/Course");
var jwt = require("jsonwebtoken");
const InstructorRating = require('../models/InstructorRating');
const CourseRating = require('../models/CourseRating');
const Subtitle = require('../models/Subtitle');
const Video = require('../models/Video');
const Exercise = require('../models/Exercise');
const mongoose = require("mongoose");
const Contract = require('../models/Contract');
const Wallet = require('../models/Wallet');
const bcrypt = require("bcrypt");
const { getWallet } = require('../controllers/walletController');


/* GET instructors listing. */
router.get('/', async function (req, res) {
  res.send(await Instructor.find());
});

//Instructor Login
router.post("/login", async (req, res) => {
  const instructorLogin = req.body
  await Instructor.findOne({ username: instructorLogin.username }).populate("walletId").then(async (instructor) => {
    if (instructor && await bcrypt.compare(instructorLogin.password, instructor.password)) {
      const payload = instructor.toJSON()
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        //{expiresIn: 86400},
        (err, token) => {
          if (err) return res.json({ message: err })
          return res.status(200).json({ message: "Success", payload: payload, token: "Instructor " + token })
        }
      )
    } else {
      return res.json({ message: "Invalid username or password" })
    }
  })
})

//View contract
router.get('/getContract', verifyInstructor, async function (req, res) {
  try {
    var result = await Contract.findOne({ instructorId: req.reqId })
    res.status(200).json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})


//Accept or reject contract
router.put('/contractResponse', verifyInstructor, async function (req, res) {
  try {
    var result = await Contract.findByIdAndUpdate(req.body.contractId, { $set: { status: req.body.response } }, { new: true })
    res.status(200).json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

//View wallet
router.get('/getWallet', verifyInstructor, async function (req, res) {
  try {
    var result = await Wallet.findOne({ id: req.reqId })
    res.status(200).json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

//Instructor select country
router.post("/selectCountry", verifyInstructor, async (req, res) => {
  try {
    await Instructor.updateOne({ _id: req.reqId }, { country: req.body.country })
    var user = await Instructor.findById(req.reqId)
    return res.status(200).json(user)
  } catch (err) {
    return res.status(400).json({ message: "Update Failed" })
  }
})

//view ratings and reviews of instructor
router.get('/viewOwnRatings', verifyInstructor, async function (req, res) {
  try {
    var ratingreview = await InstructorRating.find({ instructorId: req.reqId }, { rating: 1, review: 1 });
    res.status(200).json(ratingreview);
  } catch (err) {
    res.status(400).json({ message: err.message })
  }

});


//edit minibiography or email
router.put("/editMinibiographyorEmail", verifyInstructor, async (req, res) => {
  try {
    var update = {
      name: req.body.name ? req.body.name : undefined,
      bio: req.body.bio ? req.body.bio : undefined,
      email: req.body.email ? req.body.email : undefined,
      country: req.body.country ? req.body.country : undefined
    }
    console.log(update)
    var user = await Instructor.findByIdAndUpdate(req.reqId, update, { new: true }).select({ password: 0 });
    return res.status(200).json(user)
  } catch (err) {
    return res.status(400).json({ message: "Edit Failed" })
  }
})
module.exports = router;

//view ratings and reviews of instructors' courses
router.get('/viewCourseRatings', verifyInstructor, async function (req, res) {
  try {
    var courses = await Course.find({ instructorId: req.reqId });
    var courseIds = courses.map((course) => course._id.toString());
    var results = await CourseRating.find({ courseId: { $in: courseIds } }).populate({ path: "courseId", select: { _id: 1, title: 1 } }).select(["rating", "review", "courseId"]).sort("courseId")
    res.status(200).json(results)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

//define discount and for how long
router.post('/defineDiscount', verifyInstructor, async function (req, res) {
  try {
    var result = await Course.findByIdAndUpdate(req.body.courseId, { $set: { discount: req.body.discount, deadline: req.body.deadline } }, { new: true })
    res.status(200).json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

//Add course preview video
router.post('/coursePreview', verifyInstructor, async function (req, res) {
  try {
    var newVid = await Video.create({ title: req.body.title, description: req.body.description, url: req.body.url })
    var result = await Course.findByIdAndUpdate(req.body.courseId, { $set: { videoId: newVid._id } }, { new: true })
    res.status(200).json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

//Add subtitle video
router.post('/subtitleVideo', verifyInstructor, async function (req, res) {
  try {
    var newVid = await Video.create({ title: req.body.title, description: req.body.description, url: req.body.url })
    var result = await Subtitle.findByIdAndUpdate(req.body.subtitleId, { $set: { videoId: newVid._id } }, { new: true })
    res.status(200).json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

//Publish course
router.post('/publish', verifyInstructor, async function (req, res) {
  try {
    var result = await Course.findByIdAndUpdate(req.body.courseId, { $set: { published: true } }, { new: true })
    res.status(200).json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// create subtitle exercise
router.post('/createSubtitleExercise', verifyInstructor, async function (req, res) {
  try {
    var subtitle = await Subtitle.findById(req.body.subtitleId).populate("courseId")
    if (mongoose.Types.ObjectId(subtitle.courseId.instructorId).toString() === req.reqId) {
      const exercise = new Exercise({
        questions: req.body.questions, //Comes in as an array of strings
        choices: req.body.choices, //Comes in as an array of arrays of strings
        marks: req.body.marks, //Comes in as an array of integers
        correctIndecies: req.body.correctIndecies, //Comes in as an array of integers
      })
      const newExercise = await exercise.save()
      subtitle.$set("exerciseId", newExercise._id);
      await subtitle.save()
      res.status(201).json(newExercise)
    } else {
      res.status(500).json({ message: "You are not the instructor for this course" })
    }
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: err.message })
  }
});

// create course exam
router.post('/createCourseExercise', verifyInstructor, async function (req, res) {
  try {
    var course = await Course.findOne({ _id: req.body.courseId, instructorId: req.reqId })
    if (course) {
      const exercise = new Exercise({
        questions: req.body.questions, //Comes in as an array of strings
        choices: req.body.choices, //Comes in as an array of arrays of strings
        marks: req.body.marks, //Comes in as an array of integers
        correctIndecies: req.body.correctIndecies, //Comes in as an array of integers
      })
      const newExercise = await exercise.save()
      course.$set("examId", newExercise._id);
      await course.save()
      res.status(201).json(newExercise)
    } else {
      res.status(403).json({ message: "You are not the instructor for this course" })
    }
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: err.message })
  }
});

//view the amount available in their wallet from refunded courses
router.get('/wallet', verifyInstructor, async function (req, res) {
  await getWallet(req, res);
})

//report problem with course
router.post('/reportProblem', verifyInstructor, async function (req, res) {
  await reportProblem(req, res);
});
/* Functions */



module.exports = router;

