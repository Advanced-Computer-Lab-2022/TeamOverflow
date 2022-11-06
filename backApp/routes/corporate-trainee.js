var express = require('express');
var router = express.Router();
var CorporateTrainee = require("../models/CorporateTrainee")
const jwt = require("jsonwebtoken");
const { verifyAllUsersCorp, verifyCorpTrainee } = require('../auth/jwt-auth');
const CourseRating = require('../models/CourseRating');
const InstructorRating = require("../models/InstructorRating");
const Course = require('../models/Course');
const Instructor = require("../models/Instructor");

/* GET corporate trainees listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');

});

//Corporate Trainee Login
router.post("/login", async (req,res) => {
  const traineeLogin = req.body
  await CorporateTrainee.findOne({username: traineeLogin.username, password: traineeLogin.password}, {password: 0}).then( trainee => {
    if(trainee) {
      const payload = JSON.parse(JSON.stringify(trainee))
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        //{expiresIn: 86400},
        (err, token) => {
          if(err) return res.json({message: err})
          return res.status(200).json({message: "Success", payload: payload, token: "Corporate "+token})
        }
      )
    } else {
      return res.json({message: "Invalid username or password"})
    }
  })
})

router.post("/selectCountry",verifyAllUsersCorp , async (req,res) => {
  try{
    await CorporateTrainee.updateOne({_id:req.reqId},{country: req.body.country})
  var user= await CorporateTrainee.findById(req.reqId)
  return res.status(200).json(user)
  } catch(err){
    return res.status(400).json({message: "Update Failed"})
  }
  })

//add instructor review
router.post('/rate/instructor', verifyCorpTrainee, async function(req, res) {
  var ratingBefore = await InstructorRating.findOne({userId: req.reqId, instructorId: req.body.instructorId})
  if(ratingBefore){
    return res.status(200).json({message: "You have rated this instructor before"})
  }
  const review = new InstructorRating({
    rating:req.body.rating,
    review:req.body.review,
    instructorId:req.body.instructorId,
    userId: req.reqId
  })
  try{
    const newReview =  await review.save()
    var instructor = await Instructor.findById(req.body.instructorId);
    var newRate = ((instructor.rating || newReview.rating) + newReview.rating)/2
    await instructor.updateOne({rating: newRate})
    res.status(200).json(newReview)
  }catch(err){
    res.status(400).json({message: err.message}) 
  }
});

//add course review
router.post('/rate/course', verifyCorpTrainee, async function(req, res) {
  var ratingBefore = await CourseRating.findOne({userId: req.reqId, courseId: req.body.courseId})
  if(ratingBefore){
    return res.status(200).json({message: "You have rated this course before"})
  }
  const review = new CourseRating({
    rating:req.body.rating,
    review:req.body.review,
    courseId:req.body.courseId,
    userId: req.reqId
  })
  try{
    const newReview =  await review.save()
    var course = await Course.findById(req.body.courseId);
    var newRate = ((course.rating || newReview.rating) + newReview.rating)/2
    await course.updateOne({rating: newRate})
    res.status(200).json(newReview)
  }catch(err){
    res.status(400).json({message: err.message}) 
  }
});

/* Functions */


module.exports = router;
