var express = require('express');
var router = express.Router();
const { DB_URL } = require('./consts.json')
const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");

//MongoDB Client
const client = new MongoClient(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Connecting to database using mongoose
mongoose.connect(DB_URL,{
  useNewUrlParser:true,
  useUnifiedTopology:true
})

//Schema Definition
var courseSchema = new mongoose.Schema({
    title: String,
    subtitle: String,
    subject: String,
    summary: String,
    instructorId: Number,
})

var Course = mongoose.model("Course",courseSchema);

/* GET Courses listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* Functions */

module.exports = router;
