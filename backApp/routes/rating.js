var express = require('express');
var router = express.Router();
const CourseRating = require("../models/CourseRating");
const InstructorRating = require("../models/InstructorRating");
const Course = require("../models/Course");
const Instructor = require("../models/Instructor");
const { verifyAnyTrainee } = require('../auth/jwt-auth');
const { getCourseReviews, getInstructorReviews } = require('../controllers/studentController');

//add instructor review
router.post('/instructor', verifyAnyTrainee, async function (req, res) {
  var ratingBefore = await InstructorRating.findOne({ userId: req.reqId, instructorId: req.body.instructorId })
  if (ratingBefore) {
    return res.status(200).json({ message: "You have rated this instructor before" })
  }
  const review = new InstructorRating({
    rating: req.body.rating,
    review: req.body.review,
    instructorId: req.body.instructorId,
    userId: req.reqId
  })
  try {
    const newReview = await review.save();
    var instructor = await Instructor.findById(req.body.instructorId);
    var newRate = instructor.rating ? ((instructor.numberOfRatings * instructor.rating) + req.body.rating) / (instructor.numberOfRatings + 1) : req.body.rating;
    await instructor.updateOne({ rating: newRate, numberOfRatings: instructor.numberOfRatings + 1 });
    res.status(200).json(newReview)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
});

//add course review
router.post('/course', verifyAnyTrainee, async function (req, res) {
  var ratingBefore = await CourseRating.findOne({ userId: req.reqId, courseId: req.body.courseId })
  if (ratingBefore) {
    return res.status(200).json({ message: "You have rated this course before" })
  }
  const review = new CourseRating({
    rating: req.body.rating,
    review: req.body.review,
    courseId: req.body.courseId,
    userId: req.reqId
  })
  try {
    const newReview = await review.save();
    var course = await Course.findById(req.body.courseId);
    var newRate = course.rating ? ((course.numberOfRatings * course.rating) + req.body.rating) / (course.numberOfRatings + 1) : req.body.rating;
    await course.updateOne({ rating: newRate, numberOfRatings: course.numberOfRatings + 1 });
    res.status(200).json(newReview)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
});

//get course reviews
router.get('/course', verifyAnyTrainee, async function (req, res) {
  await getCourseReviews(req, res)
});

//get instructor reviews
router.get('/instructor', verifyAnyTrainee, async function (req, res) {
  await getInstructorReviews(req, res)
});

/* Functions */

module.exports = router;