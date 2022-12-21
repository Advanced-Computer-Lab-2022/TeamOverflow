var express = require('express');
var router = express.Router();
var CorporateTrainee = require("../models/CorporateTrainee")
const jwt = require("jsonwebtoken");
const { verifyAllUsersCorp, verifyCorpTrainee } = require('../auth/jwt-auth');
const CourseRating = require('../models/CourseRating');
const InstructorRating = require("../models/InstructorRating");
const Course = require('../models/Course');
const Subtitle = require('../models/Subtitle');
const Instructor = require("../models/Instructor");
const Exercise = require("../models/Exercise");
const Answer = require("../models/StudentAnswer");
const Video = require("../models/Video");
var StudentCourses = require("../models/StudentCourses");
const { openExercise, getGrade, submitSolution, openCourse, watchVideo, getRegistered,  requestCourse} = require('../controllers/studentController');
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

/* GET corporate trainees listing. */
router.get('/', async function (req, res) {
  res.send(await CorporateTrainee.find());

});

//create corporate trainee
router.post('/create', async function (req, res) {
  try {
    var found = await CorporateTrainee.findOne({ username: req.body.username })
    if (found) {
      return res.status(400).json({ message: "Corporate Trainee username already exists" })
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    var newCorporateTrainee = new CorporateTrainee({
      username: req.body.username,
      password: hash,
      name: req.body.name,
      corporation: req.body.corporation,
      email: req.body.email,
      country: req.body.country
    })
    await newCorporateTrainee.save()
    return res.status(200).json(newCorporateTrainee)
  } catch (err) {
    return res.status(400).json({ message: err.message })
  }
})


//Corporate Trainee Login
router.post("/login", async (req, res) => {
  const traineeLogin = req.body
  await CorporateTrainee.findOne({ username: traineeLogin.username }).then(async(trainee) => {
    if (trainee && await bcrypt.compare(traineeLogin.password, trainee.password)) {
      const payload = trainee.toJSON()
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        //{expiresIn: 86400},
        (err, token) => {
          if (err) return res.json({ message: err })
          return res.status(200).json({ message: "Success", payload: payload, token: "Corporate " + token })
        }
      )
    } else {
      return res.json({ message: "Invalid username or password" })
    }
  })
})

router.post("/selectCountry", verifyCorpTrainee, async (req, res) => {
  try {
    await CorporateTrainee.updateOne({ _id: req.reqId }, { country: req.body.country })
    var user = await CorporateTrainee.findById(req.reqId)
    return res.status(200).json(user)
  } catch (err) {
    return res.status(400).json({ message: "Update Failed" })
  }
})

//add instructor review
router.post('/rate/instructor', verifyCorpTrainee, async function (req, res) {
  var ratingBefore = await InstructorRating.findOne({ userId: req.reqId, instructorId: req.body.instructorId })
  if (ratingBefore) {
    return res.status(200).json({ message: "You have rated this instructor before" })
  }
  const review = new InstructorRating({
    rating: req.body.rating,
    review: req.body.review,
    instructorId: req.body.instructorId,
    userId: req.reqId
  })
  try {
    const newReview = await review.save()
    var instructor = await Instructor.findById(req.body.instructorId);
    var newRate = instructor.rating ? ((instructor.numberOfRatings * instructor.rating) + req.body.rating) / (instructor.numberOfRatings + 1) : req.body.rating;
    await instructor.updateOne({ rating: newRate, numberOfRatings: instructor.numberOfRatings + 1 });
    res.status(200).json(newReview)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
});

//add course review
router.post('/rate/course', verifyCorpTrainee, async function (req, res) {
  var ratingBefore = await CourseRating.findOne({ userId: req.reqId, courseId: req.body.courseId })
  if (ratingBefore) {
    return res.status(200).json({ message: "You have rated this course before" })
  }
  const review = new CourseRating({
    rating: req.body.rating,
    review: req.body.review,
    courseId: req.body.courseId,
    userId: req.reqId
  })
  try {
    const newReview = await review.save()
    var course = await Course.findById(req.body.courseId);
    var newRate = course.rating ? ((course.numberOfRatings * course.rating) + req.body.rating) / (course.numberOfRatings + 1) : req.body.rating;
    await course.updateOne({ rating: newRate, numberOfRatings: course.numberOfRatings + 1 });
    res.status(200).json(newReview)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}); 

//submit the answers to the exercise after completing it
router.post('/submitSolution', verifyCorpTrainee, async function (req, res) {
  await submitSolution(req,res);
});

//delete student answer
router.delete('/deleteAnswer', verifyCorpTrainee, async function (req, res) {
  try {
    var answer = await Answer.findByIdAndDelete(req.body.answerId);
    res.status(200).json({ message: "Deleted Successfully" })
  }
  catch (err) {
    res.status(400).json({ message: err.message })
  }

});


//view his/her grade from the exercise
router.get('/viewGrade', verifyCorpTrainee, async function (req, res) {
  await getGrade(req,res);
});



//view the questions with the correct solution to view the incorrect answers
router.get('/viewExercise', verifyCorpTrainee, async function (req, res) {
  await openExercise(req, res);
});


//watch a video from a course he/she is registered for
router.get('/watchVideo', verifyCorpTrainee, async function (req, res) {
  try{
    if(await StudentCourses.findOne({courseId: req.query.courseId, traineeId: req.reqId})){
      await watchVideo(req, res)
    } else {
      res.status(403).json({message: "You are not registered to this course"})
    }
  } catch(err) {
    res.status(400).json({message: err.message})
  }
});

router.get('/getRegisteredCourses', verifyCorpTrainee, async function (req, res) {
  await getRegistered(req, res);
});

router.get('/openCourse', verifyCorpTrainee, async function (req, res) {
  try{
    if(await StudentCourses.findOne({courseId: req.query.courseId, traineeId: req.reqId})){
      await openCourse(req, res)
    } else {
      res.status(403).json({message: "You are not registered to this course"})
    }
  } catch(err) {
    res.status(400).json({message: err.message})
  }
});

//get progress of a course he/she is registered for
router.get('/getProgress', verifyCorpTrainee, async function (req, res) {
  try {
    const regCourse = await StudentCourses.findOne({ courseId: req.query.courseId, traineeId: req.reqId })
    if (regCourse) {
      await getProgress(req, res, regCourse)
    } else {
      res.status(403).json({ message: "You are not registered to this course" })
    }
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
});

// request access to a specific course they do not have access to
router.get('/reqCourse', verifyCorpTrainee, async function (req, res) {
  await  requestCourse(req, res) ;
});

//download certificate as a pdf 
router.get('/downloadCertificate', verifyCorpTrainee, async function (req, res) {
  try {
    const regCourse = await StudentCourses.findOne({ courseId: req.query.courseId, traineeId: req.reqId })
    if (regCourse) {
      await downloadCertificate(req, res, regCourse)
    } else {
      res.status(403).json({ message: "You are not registered to this course" })
    }
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
});

//download notes as a pdf 
router.get('/downloadNotes', verifyCorpTrainee, async function (req, res) {
  try {
    const regCourse = await StudentCourses.findOne({ courseId: req.query.courseId, traineeId: req.reqId })
    if (regCourse) {
      await downloadNotes(req, res, regCourse)
    } else {
      res.status(403).json({ message: "You are not registered to this course" })
    }
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
});
//report problem with course
router.post('/reportProblem', verifyCorpTrainee, async function (req, res) {
  await reportProblem(req,res);
});
/* Functions */


module.exports = router;
