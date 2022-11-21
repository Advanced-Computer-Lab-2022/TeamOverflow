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
var exchange
var currencies = require("country-json/src/country-by-currency-code.json")
var subjects = require("../public/jsons/subjects.json")
router.use(express.json())
const {verifyAllUsers, verifyInstructor, verifyAllUsersCorp} = require("../auth/jwt-auth");
const { default: mongoose } = require("mongoose");

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
    var results = await Course.find({}, {title : 1, totalHours : 1, rating : 1})
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
    var results = await filterCourse(req.query, req.reqId)
    res.status(200).json(results)
  }catch(err){
    res.status(400).json({message: err.message}) 
  }
});

// Search for all courses
router.get('/search/course', verifyAllUsersCorp ,async function(req, res) {
  try{
    var results = await searchforcourse(req.query)
    res.status(200).json(results)
  }catch(err){
    res.status(400).json({message: err.message}) 
  }
});

//filter course by price
router.get('/filter', verifyAllUsers ,async function(req, res) {
  try{
    var results = await filterCourseByPrice(req.query)
    res.status(200).json(results)
  }catch(err){
    res.status(400).json({message: err.message}) 
  }
});

//filter course by subject and/or rating
router.get('/filter/subjrate', verifyAllUsersCorp ,async function(req, res) {
  try{
    var results = await filterCourseBySubjRating(req.query)
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

// create exercise
router.post('/createExercise' ,async function(req, res) {
  const exercise = new Exercise({
    title: req.body.title,
    courseId: req.body.courseId,
    question: req.body.question,
    answer: req.body.answer
  })
  try{
    const newExercise =  await exercise.save()
    res.status(201).json(newExercise)
  }catch(err){
    res.status(400).json({message: err.message}) 
  }
});

// create video
router.post('/createVideo' ,async function(req, res) {
  const video = new Video({
    title: req.body.title,
    description: req.body.description,
    url: req.body.url,
    courseId: req.body.courseId
  })
  try{
    const newVideo =  await video.save()
    res.status(201).json(newVideo)
  }catch(err){
    res.status(400).json({message: err.message}) 
  }
});

/* Functions */

async function searchCourseInstructor(data, instructorId){
  var query = ".*"+data.query+".*"
  const mongoQuery = { $and: [{instructorId: mongoose.Types.ObjectId(instructorId)},{$or: [{subject: {$regex: new RegExp(query, 'i')}}, {title: {$regex: new RegExp(query, 'i')}}]}]}
  var results = await Course.find(mongoQuery)
  return results
}

async function searchforcourse(data){
  var query = ".*"+data.query+".*"
  var instructors = await Instructor.find({name: {$regex: new RegExp(query, 'i')}},{_id: 1})
  var instructorIds = instructors.map((instructor) => instructor._id.toString())
  const mongoQuery = { $or : [{instructorId: {$in: instructorIds}  },{subject: {$regex: new RegExp(query, 'i')}}, {title: {$regex: new RegExp(query, 'i')}}]}
  var results = await Course.find(mongoQuery)
  return results
}

async function filterCourse(data, instructorId){
  var {subject, minPrice, maxPrice} = data
  var sub = subject||{$regex: ".*"}
  var min = minPrice||0
  var max = maxPrice||10000
  const mongoQuery = { $and: [{instructorId: mongoose.Types.ObjectId(instructorId)},{subject: sub}, {price: { $gte : min, $lt : max}}]}
  var results = await Course.find(mongoQuery)
  return results
}

async function filterCourseByPrice(data){
  var {minPrice, maxPrice} = data
  var min = minPrice||0
  var max = maxPrice||10000
  const mongoQuery = { $and: [{price: { $gte : min, $lt : max}}]}
  var results = await Course.find(mongoQuery)
  return results
}

async function filterCourseBySubjRating(data){
  var {minRating, maxRating, subject} = data
  var min = minRating||0
  var max = maxRating||5
  var subj = subject || {$regex:".*"}
  const mongoQuery = { $and: [{rating: { $gte : min, $lte : max}},{subject:subj}]}
  var results = await Course.find(mongoQuery)
  return results
}

async function findCourseAndSubtitles(id, reqId){
  var user = (await Trainee.findById(reqId) || await Corporate.findById(reqId) || await Instructor.findById(reqId))
  var course = await Course.findById(id)
  var subtitles = await Subtitle.find({courseId: id})
  var courseObj = JSON.parse(JSON.stringify(course))
  var curr = currencies.filter((elem) => elem.country === user?.country)[0]?.currency_code
  await updateRates()
  var price = courseObj.price
  var rate = exchange.rates[curr] || exchange.rates.USD
  courseObj.price = price * rate
  courseObj.subtitles = JSON.parse(JSON.stringify(subtitles))
  return courseObj
}

//API call to update exchange rates
async function updateRates() {
  if(!exchange || moment(exchange.lastUpdate).add(1, "day").isBefore(moment())){
    var ex = await axios.get("https://v6.exchangerate-api.com/v6/76b74834bd41f9920042f73c/latest/USD")
    exchange = {lastUpdate: ex.data.time_last_update_utc, rates: ex.data.conversion_rates}
    console.log(`Exchange rates updated: ${exchange.lastUpdate}`)
  }
}


module.exports = router;

