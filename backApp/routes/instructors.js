var express = require('express');
var router = express.Router();
var Instructor = require("../models/Instructor");
var Course = require("../models/Course");
var jwt = require("jsonwebtoken");
const { verifyAllUsersCorp, verifyInstructor } = require('../auth/jwt-auth');
const InstructorRating = require('../models/InstructorRating');
const CourseRating = require('../models/CourseRating');
const Subtitle = require('../models/Subtitle');
const Video = require('../models/Video');

/* GET instructors listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

//Instructor Login
router.post("/login", async (req,res) => {
  const instructorLogin = req.body
  await Instructor.findOne({username: instructorLogin.username, password: instructorLogin.password}).then( instructor => {
    if(instructor) {
      const payload = JSON.parse(JSON.stringify(instructor))
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        //{expiresIn: 86400},
        (err, token) => {
          if(err) return res.json({message: err})
          return res.status(200).json({message: "Success", payload: payload ,token: "Instructor "+token})
        }
      )
    } else {
      return res.json({message: "Invalid username or password"})
    }
  })
})

//Instructor select country
router.post("/selectCountry",verifyInstructor , async (req,res) => {
  try{
    await Instructor.updateOne({_id:req.reqId},{country: req.body.country})
  var user= await Instructor.findById(req.reqId)
  return res.status(200).json(user)
  } catch(err){
    return res.status(400).json({message: "Update Failed"})
  }
  })

//view ratings and reviews of instructor
router.get('/viewOwnRatings', verifyInstructor, async function(req, res) {
  try{
    var ratingreview = await InstructorRating.find({instructorId: req.reqId}, {title : 1, rating: 1, review, numberOfRatings: 1});
    res.status(200).json(ratingreview);
  }catch(err){
    res.status(400).json({message: err.message}) 
  }

});

//view ratings and reviews of instructors' courses
router.get('/viewCourseRatings', verifyInstructor ,async function(req, res) {
  try{
    var courses = await Course.find({instructorId: req.reqId});
    var courseIds = courses.map((course) => course._id);
    var results = await CourseRating.find({courseId: {$in: courseIds}}).select(["rating", "review", "courseId"])
    res.status(200).json(results)
  }catch(err){
    res.status(400).json({message: err.message}) 
  }
})

//define discount and for how long
router.put('/discountLong', verifyInstructor ,async function(req, res) {  
  try{
    var result = await Course.findByIdAndUpdate(req.reqId, {$set: {discount:req.body.discount,period:req.body.period}},{new: true})
    res.status(200).json(result)
  }catch(err){
    res.status(400).json({message: err.message}) 
  }
})

//Add course preview video
router.post('/coursePreview', verifyInstructor ,async function(req, res) {  
  try{
    var newVid = await Video.create({title: req.body.title, description: req.body.description, url: req.body.url})
    var result = await Course.findByIdAndUpdate(req.body.courseId, {$set: {videoId: newVid._id}}, {new: true})
    res.status(200).json(result)
  }catch(err){
    res.status(400).json({message: err.message}) 
  }
})

//Add subtitle video
router.post('/subtitleVideo', verifyInstructor ,async function(req, res) {  
  try{
    var newVid = await Video.create({title: req.body.title, description: req.body.description, url: req.body.url})
    var result = await Subtitle.findByIdAndUpdate(req.body.subtitleId, {$set: {videoId: newVid._id}}, {new: true})
    res.status(200).json(result)
  }catch(err){
    res.status(400).json({message: err.message}) 
  }
})

/* Functions */



module.exports = router;