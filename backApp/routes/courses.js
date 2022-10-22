const express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const { title } = require("process");
const Course = require('../models/Course');
router.use(express.json())

// GET Courses listing
router.get('/', async function(req, res) {
  const courses = await Course.find()
  res.send(courses)
})

// Search for course
router.get('/search/instructor', async function(req, res) {
  try{
    var results = await searchCourse(req.query)
    res.status(200).json(results)
  }catch(err){
    res.status(400).json({message: err.message}) 
  }
});

// View course
router.get('/view', async function(req, res) {
  try{
    var results = await Course.findById(req.query.id)
    res.status(200).json(results)
  }catch(err){
    res.status(400).json({message: err.message}) 
  }
});
//view course instructor
router.get('/view/instructor', async function(req, res) {
  try{
    var results = await Course.find({instructorId : req.query.instructorId}, {title : 1, _id: 0})
    res.status(200).json(results)
  }catch(err){
    res.status(400).json({message: err.message}) 
  }
});

//view course price
router.get('/viewPrices', async function(req, res) {
  try{
    var results = await Course.find({}, {title : 1, price : 1})
    res.status(200).json(results)
  }catch(err){
    res.status(400).json({message: err.message}) 
  }
});

// Search for course
router.get('/filter/instructor', async function(req, res) {
  try{
    var results = await filterCourse(req.query)
    res.status(200).json(results)
  }catch(err){
    res.status(400).json({message: err.message}) 
  }
});

//filter course by price
router.get('/filter', async function(req, res) {
  try{
    var results = await filterCourseByPrice(req.query)
    res.status(200).json(results)
  }catch(err){
    res.status(400).json({message: err.message}) 
  }
});

// Creating a new Course
router.post('/create', async function(req, res) {
  const course = new Course({
    title: req.body.title,
    subtitle: req.body.subtitle,
    subject: req.body.subject,
    summary: req.body.summary,
    price: req.body.price,
    instructorId: req.body.instructorId
  })
  try{
     const newCourse =  await course.save()
     res.status(201).json(newCourse)
  }catch(err){
    res.status(400).json({message: err.message}) 
  }
});

/* Functions */

async function searchCourse(data){
  var query = ".*"+data.query+".*"
  const mongoQuery = { $and: [{instructorId: data.instructorId},{$or: [{subject: {$regex: new RegExp(query, 'i')}}, {title: {$regex: new RegExp(query, 'i')}}]}]}
  var results = await Course.find(mongoQuery)
  return results
}

async function filterCourse(data){
  var {instructorId, subject, minPrice, maxPrice} = data
  var sub = subject||{$regex: ".*"}
  var min = minPrice||0
  var max = maxPrice||10000
  const mongoQuery = { $and: [{instructorId: instructorId},{subject: sub}, {price: { $gte : min, $lt : max}}]}
  var results = await Course.find(mongoQuery)
  return results
}

async function filterCourseByPrice(data){
  var {minPrice, maxPrice} = data
  var min = minPrice||0
  var max = maxPrice||10000
  const mongoQuery2 = { $and: [{price: { $gte : min, $lt : max}}]}
  var results = await Course.find(mongoQuery2)
  return results
}

module.exports = router;
