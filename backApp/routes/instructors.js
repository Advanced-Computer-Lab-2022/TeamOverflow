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
const { reportProblem, viewReports, viewOneReport, addFollowup } = require('../controllers/reportController');
const { findByIdAndDelete } = require('../models/Instructor');
const { getCode, forexCode } = require('../controllers/currencyController');
const moment = require("moment");

/* GET instructors listing. */
router.get('/', async function (req, res) {
  res.send(await Instructor.find());
});

//View contract
router.get('/getContract', verifyInstructor, async function (req, res) {
  try {
    var result = await Contract.findOne({ instructorId: req.reqId })
    res.status(200).json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

//Accept contract
router.put('/contractResponse', verifyInstructor, async function (req, res) {
  try {
    req.user.$set("acceptedContract", true)
    var result = await req.user.save()
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
    if (moment(req.body.startDate).isBefore(req.body.deadline)) {
      var result = await Course.findByIdAndUpdate(req.body.courseId, { $set: { discount: req.body.discount, startDate: req.body.startDate, deadline: req.body.deadline } }, { new: true })
      res.status(200).json(result)
    } else {
      res.status(403).json({ message: "Deadline cannot be before start date" })
    }
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

//Add course preview video
router.post('/coursePreview', verifyInstructor, async function (req, res) {
  try {
    var course = await Course.findOne({ _id: req.body.courseId, instructorId: req.reqId })
    if (course) {
      var newVid = await Video.create({ title: req.body.title, description: req.body.description, url: req.body.url })
      var result = await Course.findByIdAndUpdate(req.body.courseId, { $set: { videoId: newVid._id } }, { new: true })
      res.status(200).json(result)
    } else if (course?.published) {
      res.status(400).json({ message: "Course is already published" })
    } else {
      res.status(403).json({ message: "You are not the instructor for this course" })
    }
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

//Add subtitle video
router.post('/subtitleVideo', verifyInstructor, async function (req, res) {
  try {
    var subtitle = await Subtitle.findById(req.body.subtitleId)
    var course = await Course.findOne({ _id: subtitle.courseId, instructorId: req.reqId })
    if (course) {
      var newVid = await Video.create({ title: req.body.title, description: req.body.description, url: req.body.url })
      var result = await Subtitle.findByIdAndUpdate(req.body.subtitleId, { $set: { videoId: newVid._id } }, { new: true })
      res.status(200).json(result)
    } else if (course?.published) {
      res.status(400).json({ message: "Course is already published" })
    } else {
      res.status(403).json({ message: "You are not the instructor for this course" })
    }
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

//Publish course
router.post('/publish', verifyInstructor, async function (req, res) {
  try {
    var result = await Course.findOneAndUpdate({ _id: req.body.courseId, instructorId: req.reqId, closed: false }, { $set: { published: true } }, { new: true })
    if (result) {
      await courseView(req, res)
    } else {
      res.status(403).json({ message: "You are not allowed to publish this course" })
    }
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

//Unpublish a course
router.post('/close', verifyInstructor, async function (req, res) {
  try {
    var result = await Course.findOneAndUpdate({ _id: req.body.courseId, instructorId: req.reqId, closed: false, published: true }, { $set: { published: false, closed: true } }, { new: true })
    if (result) {
      await courseView(req, res)
    } else {
      res.status(403).json({ message: "You are not allowed to close this course" })
    }
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

//Delete an unpublished course
router.delete('/course', verifyInstructor, async function (req, res) {
  try {
    var result = await Course.findOne({ _id: req.query.courseId, instructorId: req.reqId })
    if (result && result.enrolled === 0 && !result.published) {
      await Exercise.findByIdAndDelete(result.examId)
      await Video.findByIdAndDelete(result.videoId)
      var subtitles = await Subtitle.find({ courseId: req.query.courseId })
      subtitles.map(async (subtitle) => {
        await Exercise.findByIdAndDelete(subtitle.exerciseId)
        await Video.findByIdAndDelete(subtitle.videoId)
        await subtitle.delete()
      })
      await result.delete()
      res.status(200).json({ message: "Course Deleted" })
    } else if (result && result.enrolled > 0) {
      res.status(400).json({ message: "Students are enrolled in this course" })
    } else if (result && result.published) {
      res.status(400).json({ message: "Course is already published" })
    } else {
      res.status(403).json({ message: "You are not the instructor for this course" })
    }

  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// create subtitle exercise
router.post('/createSubtitleExercise', verifyInstructor, async function (req, res) {
  try {
    var subtitle = await Subtitle.findById(req.body.subtitleId).populate("courseId")
    var course = subtitle.courseId
    if (mongoose.Types.ObjectId(course?.instructorId).toString() === req.reqId && !course?.published) {
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
    } else if (course?.published) {
      res.status(400).json({ message: "Course is already published" })
    } else {
      res.status(403).json({ message: "You are not the instructor for this course" })
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
    if (course && !course.published) {
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
    } else if (course && course.published) {
      res.status(400).json({ message: "Course is already published" })
    } else {
      res.status(403).json({ message: "You are not the instructor for this course" })
    }
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: err.message })
  }
});

//view exam they created
router.get('/exercise', verifyInstructor, async function (req, res) {
  try {
    var result = await Exercise.findById(req.query.exerciseId)
    res.status(200).json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

//view the amount available in their wallet from refunded courses
router.get('/wallet', verifyInstructor, async function (req, res) {
  await getWallet(req, res);
})

//report a problem
router.post('/reportProblem', verifyInstructor, async function (req, res) {
  await reportProblem(req, res);
});

//view problems
router.get('/viewReports', verifyInstructor, async function (req, res) {
  await viewReports(req, res);
});

//view a problem
router.get('/viewFollowups', verifyInstructor, async function (req, res) {
  await viewOneReport(req, res);
});

//add followup to a problem
router.post('/addFollowup', verifyInstructor, async function (req, res) {
  await addFollowup(req, res);
});

/* Functions */
async function courseView(req, res) {
  var course = await Course.findById(req.body.courseId).populate("videoId")
  var subtitles = await Subtitle.find({ courseId: req.body.courseId })
  var courseObj = JSON.parse(JSON.stringify(course))
  courseObj.currency = getCode(req.user?.country)
  courseObj.price = await forexCode(courseObj.price, courseObj.currency)
  courseObj.subtitles = JSON.parse(JSON.stringify(subtitles))
  res.status(200).json(courseObj);
}


module.exports = router;

