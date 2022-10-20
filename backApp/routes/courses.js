var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
const Course = require('../models/Course');

/* GET Courses listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
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

module.exports = router;
