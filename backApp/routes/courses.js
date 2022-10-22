var express = require('express');
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var router = express.Router();
const mongoose = require("mongoose");
const Course = require('../models/Course');
const app = require('../app');

/* GET Courses listing. */
router.get('/', async function(req, res) {
  const courses = await Course.find()
  res.send(courses)
});

router.get('/search/instructor', async function(req, res) {
  var data = req.query
  var results = await searchCourse(data)
  res.writeHead(200,{"Content-Type": "application/json"})
  res.write(JSON.stringify(results))
  res.end()
});

/* Functions */

async function searchCourse(data){
  var query = ".*"+data.query+".*"
  const mongoQuery = { $and: [{instructorId: data.instructorId},{$or: [{subject: {$regex: new RegExp(query, 'i')}}, {title: {$regex: new RegExp(query, 'i')}}]}]}
  var results = await Course.find(mongoQuery)
  return results
}

//filter Courses based on price
router.get('/:min/:max', async function(req, res){
  const min = req.params.min;
  const max = req.params.max;
  

})


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
     const newCourse =  await course.save() // saves course to database
     res.status(201).json(newCourse)
  }catch(err){
    res.status(400).json({message: err.message}) // returns an error message
  }
});

module.exports = router;
