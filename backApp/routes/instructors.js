const {verifyInstructor} = require('../auth/jwt-auth'); 
var express = require('express');
var router = express.Router();
var Instructor = require("../models/Instructor");
var Course = require("../models/Course");
var jwt = require("jsonwebtoken");
const { verifyAllUsersCorp } = require('../auth/jwt-auth');
const InstructorRating = require('../models/InstructorRating');
const Subtitle = require('../models/Subtitle');


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
router.post("/selectCountry",verifyAllUsersCorp , async (req,res) => {
  try{
    await Instructor.updateOne({_id:req.reqId},{country: req.body.country})
  var user= await Instructor.findById(req.reqId)
  return res.status(200).json(user)
  } catch(err){
    return res.status(400).json({message: "Update Failed"})
  }
  })

/* Functions */

//view ratings and reviews
router.get('/viewRatingsReviews', async function(req, res) {
  try{
    var ratingreview = await InstructorRating.find({instructorId: req.body.id});
    res.status(200).json(ratingreview);
  }catch(err){
    res.status(400).json({message: err.message}) 
  }

});

//view ratings and reviews of instructors' courses
router.get('/viewRatings&ReviewsofCourse', verifyInstructor ,async function(req, res) {
  
  try{
    var results = await Course.find({instructorId : mongoose.Types.ObjectId(req.reqId)}, {title : 1, rating: 1,  numberOfRatings: 1})
    res.status(200).json(results)
  }catch(err){
    res.status(400).json({message: err.message}) 
  }
})

//define discount and for how long
router.put('/discountLong', verifyInstructor ,async function(req, res) {  
  try{
    var results = await Course.findByIdAndUpdate({instructorId : mongoose.Types.ObjectId(req.reqId)},{$set: {discount:req.body.discount,period:req.body.period}},{new: true})
    res.status(200).json(results)
  }catch(err){
    res.status(400).json({message: err.message}) 
  }
})
router.put('/youtubePreview', verifyInstructor ,async function(req, res) {  
  try{
    var results = await Course.findByIdAndUpdate({instructorId : mongoose.Types.ObjectId(req.reqId)},{$set: {urlyoutubepreview:req.body.urlyoutubepreview}},{new: true})
    res.status(200).json(results)
  }catch(err){
    res.status(400).json({message: err.message}) 
  }
})
router.put('/youtubePreview', verifyInstructor ,async function(req, res) {  
  try{
    var results = await Subtitle.findByIdAndUpdate({instructorId : mongoose.Types.ObjectId(req.reqId)},{$set: {urlyoutubesub:req.body.urlyoutubesub, ytDescription:req.body.ytDescription}},{new: true})
    res.status(200).json(results)
  }catch(err){
    res.status(400).json({message: err.message}) 
  }
})

;


module.exports = router;