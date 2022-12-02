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
const TraineeCourses = require("../models/TraineeCourses");
var CorporateTraineeCourses = require("../models/CorporateTraineeCourses")

async function openExercise(req, res) {
  try {
    var exercise = await Exercise.findById(req.query.exerciseId, { correctIndecies: 0 })
    res.status(200).json(exercise);
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
    res.status(200).json({ payload: exercise, grade: finalGrade });
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

async function submitSolution(req, res) {
  try {
    const solution = await Answer.create({ answers: req.body.answers, traineeId: req.reqId, exerciseId: req.body.exerciseId })
    res.status(200).json(solution)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

async function openCourse(req, res) {
  try {
    var course = await Course.findById(req.query.courseId).populate(["videoId", { path: "examId", select: { correctIndecies: 0 } }]).select({ examId: { correctIndecies: 0 } })
    var subtitles = await Subtitle.find({ courseId: req.query.courseId }).populate(["videoId", { path: "exerciseId", select: { correctIndecies: 0 } }])
    res.status(200).json({ course: course, subtitles: subtitles })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

async function watchVideo(req, res) {
  try {
    var video = await Video.findById(req.query.videoId);
    res.status(200).json(video)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

module.exports = { getGrade, openExercise, submitSolution, openCourse, watchVideo };