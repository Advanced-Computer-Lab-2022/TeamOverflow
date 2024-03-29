var express = require('express');
var router = express.Router();
var CorporateTrainee = require("../models/CorporateTrainee")
const jwt = require("jsonwebtoken");
const { verifyAllUsersCorp, verifyCorpTrainee } = require('../auth/jwt-auth');
const CourseRating = require('../models/CourseRating');
const InstructorRating = require("../models/InstructorRating");
const Course = require('../models/Course');
const Subtitle = require('../models/Subtitle');
const Exercise = require("../models/Exercise");
const Answer = require("../models/StudentAnswer");
const Video = require("../models/Video");
const StudentCourses = require("../models/StudentCourses");
const { forex } = require('../controllers/currencyController');
const Trainee = require('../models/Trainee');
const Requests = require('../models/Requests');
const Notes = require('../models/Notes');
const { populate } = require('../models/CourseRating');

function calculateProgress(completion) {
  var progress = 0
  if (completion) {
    var keysbyindex = Object.keys(completion);
    var total = keysbyindex.length;
    var done = 0;
    for (let i = 0; i < keysbyindex.length; i++) {
      if (completion[keysbyindex[i]]) {
        done++;
      }
    }
    progress = ((done / total) * 100).toFixed(0)
  }
  return progress
}

async function openExercise(req, res) {
  try {
    var exercise = await Exercise.findById(req.query.exerciseId, { correctIndecies: 0 })
    res.status(200).json(exercise);
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

async function getProgress(req, res, regCourse) {
  try {
    var completion = regCourse.completion
    const progress = calculateProgress(completion)
    res.status(200).json({ progress: progress, completion: completion })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

async function getGrade(req, res) {
  try {
    var solution = await Answer.findById(req.query.answerId)
    var exercise = await Exercise.findById(solution.exerciseId)
    const maxGrade = exercise.marks.reduce((a, b) => a + b, 0);
    var totalGrade = 0;
    for (let i = 0; i < exercise.marks.length; i++) {
      if (exercise.correctIndecies[i] === solution.answers[i]) {
        totalGrade += exercise.marks[i]
      }
    }
    const finalGrade = (totalGrade / maxGrade) * 100
    solution.$set("grade", finalGrade)
    await solution.save()
    res.status(200).json({ payload: exercise, yourSol: solution, grade: finalGrade });
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

async function submitSolution(req, res, regCourse) {
  try {
    const solution = await Answer.create({ answers: req.body.answers, traineeId: req.reqId, exerciseId: req.body.exerciseId })
    var completion = regCourse.completion
    completion[req.body.exerciseId] = true
    await regCourse.updateOne({ completion: completion })
    res.status(200).json({ message: "Solution Submitted" })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

async function openCourse(req, res) {
  try {
    var course = await Course.findById(req.query.courseId).populate(["videoId", { path: "examId", select: { correctIndecies: 0 } }, { path: "instructorId", select: { name: 1, email: 1, bio: 1, rating: 1, numberOfRatings: 1 } }]).select({ examId: { correctIndecies: 0 } })
    var registration = await StudentCourses.findOne({ traineeId: req.reqId, courseId: req.query.courseId })
    var courseObj = course?.toJSON()
    courseObj.progress = calculateProgress(registration.completion)
    courseObj.price = await forex(courseObj.price, req.user.country)
    var subtitles = await Subtitle.find({ courseId: req.query.courseId }).populate(["videoId", { path: "exerciseId", select: { correctIndecies: 0 } }])
    var exerciseIds = [course.examId?._id]
    exerciseIds.push(subtitles.map((subtitle) => subtitle.exerciseId?._id))
    var solutions = await Answer.find({ exerciseId: { $in: exerciseIds.flat() }, traineeId: req.reqId })
    res.status(200).json({ course: courseObj, subtitles: subtitles, examSolutions: solutions })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

async function watchVideo(req, res, regCourse) {
  try {
    var video = await Video.findById(req.query.videoId);
    var completion = regCourse.completion
    completion[req.query.videoId] = true
    await regCourse.updateOne({ completion: completion })
    res.status(200).json(video)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

async function getRegistered(req, res) {
  try {
    var results = await StudentCourses.paginate({ traineeId: req.reqId, onHold: false }, { page: req.query.page, limit: 12, populate: { path: "courseId" } })
    var allResults = []
    for (let i = 0; i < results.docs.length; i++) {
      var reqCourse = results.docs[i].toJSON()
      var completion = reqCourse.completion
      reqCourse.progress = calculateProgress(completion)
      allResults.push(reqCourse)
    }
    results.docs = allResults
    res.status(200).json(results)
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: err.message })
  }
}

async function requestCourse(req, res) {
  try {
    const regCourse = await StudentCourses.findOne({ courseId: req.body.courseId, traineeId: req.reqId })
    const requested = await Requests.findOne({ courseId: req.body.courseId, traineeId: req.reqId })
    if (!regCourse && !requested) {
      const request = new Requests({
        traineeId: req.reqId,
        courseId: req.body.courseId,
      });
      await request.save();
      return res.status(200).json({ message: "Request Made" })
    } else if (!requested) {
      res.status(403).json({ message: "You are already registered to this course" })
    } else {
      res.status(400).json({ message: "You have already requested this course" })
    }
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

async function addNote(req, res) {
  try {
    const note = new Notes({
      traineeId: req.reqId,
      videoId: req.body.videoId,
      timestamp: req.body.timestamp,
      content: req.body.content
    });
    await note.save();
    res.status(201).json({ message: "New Note Added" })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

async function getCourseReviews(req, res) {
  try {
    const results = await CourseRating.paginate({ courseId: req.query.courseId }, { page: req.query.page, limit: 12, populate: "courseId" })
    res.status(200).json(results)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

async function getInstructorReviews(req, res) {
  try {
    const results = await InstructorRating.paginate({ instructorId: req.query.instructorId }, { page: req.query.page, limit: 12, populate: { path: "instructorId", select: { name: 1, username: 1 } } })
    res.status(200).json(results)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

module.exports = { getCourseReviews, getInstructorReviews, calculateProgress, getGrade, openExercise, submitSolution, openCourse, watchVideo, getRegistered, getProgress, requestCourse, addNote };