var express = require('express');
var router = express.Router();
const Admin= require('../models/Admin')
const Instructor= require('../models/Instructor')
const CorporateTrainee= require('../models/CorporateTrainee')
const jwt = require("jsonwebtoken");
const {verifyAdmin} = require("../auth/jwt-auth");
const CorporateTraineeCourses = require('../models/CorporateTraineeCourses');
const Course = require('../models/Course');
const mongoose = require("mongoose");
const Contract = require('../models/Contract');

/* GET admins listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');

});

//Admin Login
router.post("/login", async (req,res) => {
  const adminLogin = req.body
  await Admin.findOne({username: adminLogin.username, password: adminLogin.password}, {password: 0}).then( admin => {
    if(admin) {
      const payload = JSON.parse(JSON.stringify(admin))
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        //{expiresIn: 86400},
        (err, token) => {
          if(err) return res.json({message: err})
          return res.status(200).json({message: "Success", payload: payload ,token: "Admin "+token})
        }
      )
    } else {
      return res.json({message: "Invalid username or password"})
    }
  })
})

//add admin
router.post('/addAdmin', verifyAdmin, async function(req, res) {
  var found = await Admin.findOne({username: req.body.username})
  if(found){
    return res.status(400).json({message: "Admin username already exists"})
  }
  const add = new Admin({
    username:req.body.username,
    password:req.body.password
  })
  try{
    const newAdmin =  await add.save()
    res.status(201).json(newAdmin)
  }catch(err){
    res.status(400).json({message: err.message}) 
  }
});

//add instructor
router.post('/addInstructor', verifyAdmin, async function(req, res) {
  var found = await Instructor.findOne({username: req.body.username})
  if(found){
    return res.status(400).json({message: "Instructor username already exists"})
  }
  const add = new Instructor({
    username:req.body.username,
    password:req.body.password
  })
  try{
    const newInstructor =  await add.save()
    res.status(201).json(newInstructor) 
  }catch(err){
    res.status(400).json({message: err.message}) 
  }
});

router.post('/createContract', verifyAdmin, async function(req, res) {
  try{
    const add = Contract({
      title: req.body.title,
      instructorId: req.body.instructorId,
      terms: req.body.terms,
      percentageTaken: req.body.percentageTaken,
      status: "Pending",
    })
    const newContract =  await add.save()
    res.status(201).json(newContract) 
  } catch(err) {
    res.status(400).json({message: err.message})
  }
});

//add corporate trainee
router.post('/addTrainee', verifyAdmin, async function(req, res) {
  var found = await CorporateTrainee.findOne({username: req.body.username})
  if(found){
    return res.status(400).json({message: "Corporate Trainee username already exists"})
  }
  const add = new CorporateTrainee({
    username:req.body.username,
    password:req.body.password,
    corporation:req.body.corporation
  })
  try{
    const newCorporateTrainee =  await add.save()
    res.status(201).json(newCorporateTrainee)
  }catch(err){
    res.status(400).json({message: err.message}) 
  }
});

//register corporate-trainee to a course
router.post('/registerCourse', verifyAdmin, async function(req, res) {
  try{
    if(!(await CorporateTraineeCourses.findOne({corporateTraineeId: req.body.traineeId, courseId: req.body.courseId}))){
      const traineeCourse = new CorporateTraineeCourses({
        corporateTraineeId: req.body.traineeId,
        courseId: req.body.courseId
      });
      const newTraineeCourse =  await traineeCourse.save();
      res.status(200).json(newTraineeCourse)
    } else {
      res.status(400).json({message: "Trainee already registered to this course"})
    }
  }catch(err){
    res.status(400).json({message: err.message}) 
  }
}); 

/* Functions */

module.exports = router;