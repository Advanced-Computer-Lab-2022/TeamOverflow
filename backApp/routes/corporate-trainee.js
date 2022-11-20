var express = require('express');
var router = express.Router();
var CorporateTrainee = require("../models/CorporateTrainee")
const jwt = require("jsonwebtoken");
const { verifyAllUsersCorp, verifyCorpTrainee } = require('../auth/jwt-auth');
const CourseRating = require('../models/CourseRating');
const InstructorRating = require("../models/InstructorRating");
const Course = require('../models/Course');
const Instructor = require("../models/Instructor");
const Exercise = require("../models/Exercise");
const Answer = require("../models/StudentAnswer");
const Video = require("../models/Video");


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
    var newRate = instructor.rating ? ((instructor.numberOfRatings*instructor.rating) + req.body.rating)/(instructor.numberOfRatings+1) : req.body.rating;
    await instructor.updateOne({rating: newRate, numberOfRatings: instructor.numberOfRatings+1});
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
    var newRate = course.rating ? ((course.numberOfRatings*course.rating) + req.body.rating)/(course.numberOfRatings+1) : req.body.rating;
    await course.updateOne({rating: newRate, numberOfRatings: course.numberOfRatings+1});
    res.status(200).json(newReview)
  }catch(err){
    res.status(400).json({message: err.message}) 
  }
});

//register trainee to a course
router.post('/registerCourse', async function(req, res) {
  var course = await Course.findById(req.body.courseId);
  var trainee = await CorporateTrainee.findById(req.body.traineeId);
  const traineeCourse = new TraineeCourses({
    traineeId: trainee,
    courseId: course
  });
  try{
    const newTraineeCourse =  await traineeCourse.save();
    res.status(200).json(newTraineeCourse)
    res.status(200).json({message: "Registered Successfully"})
  }catch(err){
    res.status(400).json({message: err.message}) 
  }
});  

//submit the answers to the exercise after completing it
router.post('/submitExercise', async function(req, res) {
  var course = await Course.findById(req.body.courseId);
  var trainee = await CorporateTrainee.findById(req.body.traineeId);
  var exercise = await Exercise.findById(req.body.exerciseId);
  try{
    const answer = new Answer({
      traineeId: trainee,
      courseId: course,
      exerciseId: exercise,
      answer: req.body.answer
    });
    const newAnswer =  await answer.save();
    res.status(200).json(newAnswer);

  }
  catch(err){
    res.status(400).json({message: err.message}) 
  }

});

//delete student answer
router.delete('/deleteAnswer', async function(req, res) {
  var course = await Course.findById(req.body.courseId);
  var trainee = await CorporateTrainee.findById(req.body.traineeId);
  var exercise = await Exercise.findById(req.body.exerciseId);
  var answer = await Answer.findOne({traineeId: trainee, courseId: course, exerciseId: exercise});
  try{
    await answer.deleteOne();
    res.status(200).json({message: "Deleted Successfully"})
  }
  catch(err){
    res.status(400).json({message: err.message}) 
  }

});


//view his/her grade from the exercise
router.get('/viewGrade', async function(req, res) {
  var course = await Course.findById(req.body.courseId);
  var trainee = await CorporateTrainee.findById(req.body.traineeId);
  var exercise = await Exercise.findById(req.body.exerciseId);
  var answer = await Answer.findOne({traineeId: trainee, courseId: course, exerciseId: exercise});

  var grade = 0;
  var maxGrade = answer.answer.length;
  var percentage = 0;
  try{
    for(var i = 0; i < answer.answer.length; i++){
      if(answer.answer[i] == exercise.answer[i]){
        grade++;
      }
    }
    percentage = (grade/maxGrade)*100;
    res.status(200).json(percentage+" %");
  }
  
  catch(err){
    res.status(400).json({message: err.message})
  }
});



//view the questions with the correct solution to view the incorrect answers
router.get('/viewExercise', async function(req, res) {
  try{
    var course = await Course.findById(req.body.courseId);
    var exercise = await Exercise.findById(req.body.exerciseId);
    var answer = new Array();
    for(var i = 0; i < exercise.question.length; i++){
      answer.push(exercise.question[i]+"? --> "+exercise.answer[i]);
    }
    res.status(200).json(answer);
  
  }catch(err){
    res.status(400).json({message: err.message}) 
  }

});


//watch a video from a course he/she is registered for
router.get('/watchVideo', async function(req, res) {
  try{
    var course = await Course.findById(req.body.courseId);
    var video = await Video.findOne({courseId: req.body.courseId});
    res.status(200).json(video)
  }catch(err){
    res.status(400).json({message: err.message}) 
  }
});

/* Functions */


module.exports = router;
