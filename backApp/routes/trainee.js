var express = require('express');
var router = express.Router();
const Trainee = require("../models/Trainee");
const StudentCourses = require("../models/StudentCourses");
const CourseRating = require("../models/CourseRating");
const InstructorRating = require("../models/InstructorRating");
const Course = require("../models/Course");
const Instructor = require("../models/Instructor");
const Exercise = require("../models/Exercise");
const Answer = require("../models/StudentAnswer");
const Video = require("../models/Video");
const jwt = require("jsonwebtoken");
const { verifyAllUsersCorp, verifyTrainee } = require('../auth/jwt-auth');
const { submitSolution, getGrade, openExercise, watchVideo, getRegistered, openCourse } = require('../controllers/studentController');
const mongoose = require("mongoose");
const { processPayment } = require('../controllers/paymentController');

/* GET trainees listing. */
router.get('/', function (req, res) {
  res.send('respond with a resource');

});

//Trainee Login
router.post("/login", async (req, res) => {
  const traineeLogin = req.body
  await Trainee.findOne({ username: traineeLogin.username, password: traineeLogin.password }, { password: 0 }).then(trainee => {
    if (trainee) {
      const payload = JSON.parse(JSON.stringify(trainee))
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        //{expiresIn: 86400},
        (err, token) => {
          if (err) return res.json({ message: err })
          return res.status(200).json({ message: "Success", payload: payload, token: "Trainee " + token })
        }
      )
    } else {
      return res.json({ message: "Invalid username or password" })
    }
  })
})

router.post("/selectCountry", verifyAllUsersCorp, async (req, res) => {
  try {
    await Trainee.updateOne({ _id: req.reqId }, { country: req.body.country })
    var user = await Trainee.findById(req.reqId)
    return res.status(200).json(user)
  } catch (err) {
    return res.status(400).json({ message: "Update Failed" })
  }
})

//register trainee to a course
router.post('/registerCourse', async function (req, res) {
  try {
    const response = await processPayment(req,res)
    console.log(response)
    res.status(response.statusCode).json(response)
    // var course = await Course.findById(req.body.courseId);
    // var trainee = await Trainee.findById(req.body.traineeId);
    // const traineeCourse = new StudentCourses({
    //   traineeId: trainee,
    //   courseId: course
    // });
    // const newTraineeCourse = await traineeCourse.save();
    // res.status(200).json(newTraineeCourse)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
});

//submit the answers to the exercise after completing it
router.post('/submitSolution', verifyTrainee, async function (req, res) {
  await submitSolution(req, res);
});

//delete student answer
router.delete('/deleteAnswer', verifyTrainee, async function (req, res) {
  var course = await Course.findById(req.body.courseId);
  var trainee = await Trainee.findById(req.body.traineeId);
  var exercise = await Exercise.findById(req.body.exerciseId);
  var answer = await Answer.findOne({ traineeId: trainee, courseId: course, exerciseId: exercise });
  try {
    await answer.deleteOne();
    res.status(200).json({ message: "Deleted Successfully" })
  }
  catch (err) {
    res.status(400).json({ message: err.message })
  }

});


//view his/her grade from the exercise
router.get('/viewGrade', verifyTrainee, async function (req, res) {
  await getGrade(req, res);
});



//view the questions with the correct solution to view the incorrect answers
router.get('/viewExercise', verifyTrainee, async function (req, res) {
  await openExercise(req, res);
});

router.get('/openCourse', verifyTrainee, async function (req, res) {
  try {
    if (await StudentCourses.findOne({ courseId: req.query.courseId, traineeId: req.reqId })) {
      await openCourse(req, res)
    } else {
      res.status(403).json({ message: "You are not registered to this course" })
    }
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
});

router.get('/getRegisteredCourses', verifyTrainee, async function (req, res) {
  await getRegistered(req, res);
});

//watch a video from a course he/she is registered for
router.get('/watchVideo', verifyTrainee, async function (req, res) {
  try {
    if (await StudentCourses.findOne({ courseId: req.query.courseId, traineeId: req.reqId })) {
      await watchVideo(req, res)
    } else {
      res.status(403).json({ message: "You are not registered to this course" })
    }
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
});

/* Functions */

module.exports = router;
