var express = require('express');
var router = express.Router();
const Trainee = require("../models/Trainee");
const TraineeCourses = require("../models/TraineeCourses");
const CourseRating = require("../models/CourseRating");
const InstructorRating = require("../models/InstructorRating");
const Course = require("../models/Course");
const Instructor = require("../models/Instructor");
const Exercise = require("../models/Exercise");
const Answer = require("../models/StudentAnswer");
const Video = require("../models/Video");
const jwt = require("jsonwebtoken");
const { verifyAllUsersCorp, verifyTrainee } = require('../auth/jwt-auth');
const { submitSolution, getGrade, openExercise } = require('../controllers/studentController');

/* GET trainees listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');

});

//Trainee Login
router.post("/login", async (req,res) => {
  const traineeLogin = req.body
  await Trainee.findOne({username: traineeLogin.username, password: traineeLogin.password}, {password: 0}).then( trainee => {
    if(trainee) {
      const payload = JSON.parse(JSON.stringify(trainee))
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        //{expiresIn: 86400},
        (err, token) => {
          if(err) return res.json({message: err})
          return res.status(200).json({message: "Success", payload: payload ,token: "Trainee "+token})
        }
      )
    } else {
      return res.json({message: "Invalid username or password"})
    }
  })
})

router.post("/selectCountry",verifyAllUsersCorp , async (req,res) => {
  try{
    await Trainee.updateOne({_id:req.reqId},{country: req.body.country})
  var user= await Trainee.findById(req.reqId)
  return res.status(200).json(user)
  } catch(err){
    return res.status(400).json({message: "Update Failed"})
  }
  })

//add instructor review
router.post('/rate/instructor', verifyTrainee, async function(req, res) {
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
    const newReview =  await review.save();
    var instructor = await Instructor.findById(req.body.instructorId);
    var newRate = instructor.rating ? ((instructor.numberOfRatings*instructor.rating) + req.body.rating)/(instructor.numberOfRatings+1) : req.body.rating;
    await instructor.updateOne({rating: newRate, numberOfRatings: instructor.numberOfRatings+1});
    res.status(200).json(newReview)
  }catch(err){
    res.status(400).json({message: err.message}) 
  }
});

//add course review
router.post('/rate/course', verifyTrainee, async function(req, res) {
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
    const newReview =  await review.save();
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
  var trainee = await Trainee.findById(req.body.traineeId);
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
router.post('/submitSolution', verifyTrainee ,async function(req, res) {
  await submitSolution(req,res);
});

//delete student answer
router.delete('/deleteAnswer', verifyTrainee, async function(req, res) {
  var course = await Course.findById(req.body.courseId);
  var trainee = await Trainee.findById(req.body.traineeId);
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
router.get('/viewGrade', verifyTrainee, async function(req, res) {
  await getGrade(req,res);
});



//view the questions with the correct solution to view the incorrect answers
router.get('/viewExercise', verifyTrainee, async function(req, res) {
  await openExercise(req,res);
});


//watch a video from a course he/she is registered for
router.get('/watchVideo', verifyTrainee, async function(req, res) {
  try{
    var video = await Video.findOne({courseId: req.query.courseId});
    res.status(200).json(video)
  }catch(err){
    res.status(400).json({message: err.message}) 
  }
});

/* Functions */

module.exports = router;
