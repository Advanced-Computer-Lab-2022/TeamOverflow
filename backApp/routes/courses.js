const express = require("express");
var router = express.Router();
const axios = require("axios");
const moment = require("moment");
const Course = require('../models/Course');
const Subtitle = require("../models/Subtitle");
const Trainee = require("../models/Trainee");
const Corporate = require("../models/CorporateTrainee");
const Instructor = require("../models/Instructor");
const Exercise = require("../models/Exercise");
const Video = require("../models/Video");
var subjects = require("../public/jsons/subjects.json")
router.use(express.json())
const {verifyAllUsers, verifyInstructor, verifyAllUsersCorp} = require("../auth/jwt-auth");
const { default: mongoose } = require("mongoose");
const { forex, getCode } = require("../controllers/currencyController");

// General Purpose endpoints
router.get('/', async function(req, res) {
  const courses = await Course.find()
  res.send(courses)
})

router.get('/allSubj', async function(req, res) {
  res.status(200).json(subjects)
})

// Instructor Search for course
router.get('/search/instructor', verifyInstructor ,async function(req, res) {
  try{
    var results = await searchCourseInstructor(req.query, req.reqId)
    res.status(200).json(results)
  }catch(err){
    res.status(400).json({message: err.message}) 
  }
});

// View course
router.get('/view', verifyAllUsers ,async function(req, res) {
  try{
    var result = await findCourseAndSubtitles(req.query.id, req.reqId)
    res.status(200).json(result)
  }catch(err){
    res.status(400).json({message: err.message}) 
  }
});

//view courses available
router.get('/viewAvailableCourses', verifyAllUsersCorp ,async function(req, res) {
  try{
    var results = await Course.find({}, {title : 1, totalHours : 1, rating : 1, summary:1, subject:1, price:1})
    res.status(200).json(results)
  }catch(err){
    res.status(400).json({message: err.message}) 
  }
});

// instructor view course
router.get('/view/instructor', verifyInstructor ,async function(req, res) {
  try{
    var results = await Course.find({instructorId : mongoose.Types.ObjectId(req.reqId)}, {title : 1, _id: 1})
    res.status(200).json(results)
  }catch(err){
    res.status(400).json({message: err.message}) 
  }
});

//view course price
router.get('/viewPrices', verifyAllUsers ,async function(req, res) {
  try{
    var results = await Course.find({}, {title : 1, price : 1})
    res.status(200).json(results)
  }catch(err){
    res.status(400).json({message: err.message}) 
  }
});

// Instructor filter courses
router.get('/filter/instructor', verifyInstructor ,async function(req, res) {
  try{
    var results = await instructorFilterCourse(req.query, req.reqId)
    res.status(200).json(results)
  }catch(err){
    res.status(400).json({message: err.message}) 
  }
});

// Search for all courses
router.get('/search/course', verifyAllUsersCorp ,async function(req, res) {
  try{
    var results = await searchforcourse(req.query, req.reqId)
    res.status(200).json(results)
  }catch(err){
    res.status(400).json({message: err.message}) 
  }
});

//filter course by everything
router.get('/filter', verifyAllUsersCorp ,async function(req, res) {
  try{
    var results = await filterCourse(req.query, req.reqId)
    res.status(200).json(results)
  }catch(err){
    res.status(400).json({message: err.message}) 
  }
});


// Creating a new Course
router.post('/create', verifyInstructor ,async function(req, res) {
  var subtitles = req.body.subtitles
  var totalTime = 0
  for(var i = 0; i < subtitles.length; i++){
    totalTime += parseInt(subtitles[i].time)
  }
  const course = new Course({
    title: req.body.title,
    subject: req.body.subject,
    summary: req.body.summary,
    price: req.body.price,
    discount: req.body.discount,
    instructorId: req.reqId,
    totalHours: totalTime})
  try{
    const newCourse =  await course.save()
    subtitles.map((subtitle) => subtitle.courseId = newCourse._id)
    const newSubs = await Subtitle.insertMany(subtitles)
    res.status(201).json(newCourse)
  }catch(err){
    res.status(400).json({message: err.message}) 
  }
});

/* Functions */

async function searchCourseInstructor(data, instructorId){
  var user = await Instructor.findById(instructorId)
  var query = ".*"+data.query+".*"
  const mongoQuery = { $and: [{instructorId: mongoose.Types.ObjectId(instructorId)},{$or: [{subject: {$regex: new RegExp(query, 'i')}}, {title: {$regex: new RegExp(query, 'i')}}]}]}
  var results = await Course.find(mongoQuery)
  var allResults = []
  for(let i=0; i<results.length; i++){
    var courseObj = JSON.parse(JSON.stringify(results[i]))
    courseObj.price = await forex(courseObj.price, user?.country)
    courseObj.currency = getCode(user?.country)
    allResults.push(courseObj)
  }
  return allResults
}

async function searchforcourse(data, reqId){
  var user = (await Trainee.findById(reqId) || await Corporate.findById(reqId) || await Instructor.findById(reqId))
  var query = ".*"+data.query+".*"
  var instructors = await Instructor.find({name: {$regex: new RegExp(query, 'i')}},{_id: 1})
  var instructorIds = instructors.map((instructor) => instructor._id.toString())
  const mongoQuery = { $or : [{instructorId: {$in: instructorIds}  },{subject: {$regex: new RegExp(query, 'i')}}, {title: {$regex: new RegExp(query, 'i')}}]}
  var results = await Course.find(mongoQuery)
  var allResults = []
  for(let i=0; i<results.length; i++){
    var courseObj = JSON.parse(JSON.stringify(results[i]))
    courseObj.price = await forex(courseObj.price, user?.country)
    courseObj.currency = getCode(user?.country)
    allResults.push(courseObj)
  }
  return allResults
}

async function instructorFilterCourse(data, instructorId){
  var user = await Instructor.findById(instructorId)
  var {subject, minPrice, maxPrice} = data
  var sub = subject||{$regex: ".*"}
  var min = minPrice||0
  var max = maxPrice||10000
  const mongoQuery = { $and: [{instructorId: mongoose.Types.ObjectId(instructorId)},{subject: sub}, {price: { $gte : min, $lt : max}}]}
  var results = await Course.find(mongoQuery)
  var allResults = []
  for(let i=0; i<results.length; i++){
    var courseObj = JSON.parse(JSON.stringify(results[i]))
    courseObj.price = await forex(courseObj.price, user?.country)
    courseObj.currency = getCode(user?.country)
    allResults.push(courseObj)
  }
  return allResults
}

async function filterCourse(data, reqId){
  var user = (await Trainee.findById(reqId) || await Corporate.findById(reqId) || await Instructor.findById(reqId))
  var {subject, minPrice, maxPrice, minRating, maxRating} = data
  var sub = subject||{$regex: ".*"}
  var minRate = minRating||0
  var maxRate = maxRating||5
  var min = minPrice||0
  var max = maxPrice||10000
  const mongoQuery = { $and: [{price: { $gte : min, $lt : max}}, {subject: sub}, {rating: { $gte : minRate, $lte : maxRate}}]}
  var results = await Course.find(mongoQuery)
  var allResults = []
  for(let i=0; i<results.length; i++){
    var courseObj = JSON.parse(JSON.stringify(results[i]))
    courseObj.price = await forex(courseObj.price, user?.country)
    courseObj.currency = getCode(user?.country)
    allResults.push(courseObj)
  }
  return allResults
}

async function sortCourse(data){
  var {subject, enrolled} = data
  var sub = subject||{$regex: ".*"}
  var enrolled = enrolled||0
  var results = await Course.find().sort({enrolled})
  return results
}


async function findCourseAndSubtitles(id, reqId){
  var user = (await Trainee.findById(reqId) || await Corporate.findById(reqId) || await Instructor.findById(reqId))
  var course = await Course.findById(id)
  var subtitles = await Subtitle.find({courseId: id})
  var courseObj = JSON.parse(JSON.stringify(course))
  courseObj.price = await forex(courseObj.price, user?.country)
  courseObj.currency = getCode(user?.country)
  courseObj.subtitles = JSON.parse(JSON.stringify(subtitles))
  return courseObj
}




module.exports = router;

