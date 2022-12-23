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
    var keysbyindex = Object.keys(completion);
    var total = keysbyindex.length;
    var done = 0;
    for (let i = 0; i < keysbyindex.length; i++) {
      if (completion[keysbyindex[i]]) {
        done++;
      }
    }
    const progress = (done / total) * 100
    res.status(200).json({ progress: progress.toFixed(2), completion: completion })
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
    var course = await Course.findById(req.query.courseId).populate(["videoId", { path: "examId", select: { correctIndecies: 0 } }]).select({ examId: { correctIndecies: 0 } })
    var courseObj = JSON.parse(JSON.stringify(course))
    courseObj.price = await forex(courseObj.price, req.user.country)
    var subtitles = await Subtitle.find({ courseId: req.query.courseId }).populate(["videoId", { path: "exerciseId", select: { correctIndecies: 0 } }])
    var exerciseIds = [course.examId?._id]
    exerciseIds.push(subtitles.map((subtitle) => subtitle.exerciseId?._id))
    var solutions = await Answer.find({ exerciseId: { $in: exerciseIds.flat() } })
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
    var results = await StudentCourses.paginate({ traineeId: req.reqId }, { page: req.query.page, limit: 10, populate: { path: "courseId" } })
    var allResults = []
    for (let i = 0; i < results.docs.length; i++) {
      var progress = 0
      var reqCourse = results.docs[i].toJSON()
      var completion = reqCourse.completion
      if (completion) {
        var keysbyindex = Object.keys(completion);
        var total = keysbyindex.length;
        var done = 0;
        for (let i = 0; i < keysbyindex.length; i++) {
          if (completion[keysbyindex[i]]) {
            done++;
          }
        }
        progress = (done / total) * 100
      }
      reqCourse.progress = progress
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
    const regCourse = await StudentCourses.findOne({ courseId: req.query.courseId, traineeId: req.reqId })
    if (!regCourse) {
      const request = new Requests({
        traineeId: req.reqId,
        courseId: req.query.courseId,
      });
      await request.save();
      return res.status(200).json({ message: "Request Made" })
    } else {
      res.status(403).json({ message: "You are already registered to this course" })
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

module.exports = { getGrade, openExercise, submitSolution, openCourse, watchVideo, getRegistered, getProgress, requestCourse, addNote };