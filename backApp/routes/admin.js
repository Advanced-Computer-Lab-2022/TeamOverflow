var express = require('express');
var router = express.Router();
const Admin= require('../models/Admin')
const Instructor= require('../models/Instructor')
const CorporateTrainee= require('../models/CorporateTrainee')

/* GET admins listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');

});
//add admin
router.post('/addAdmin', async function(req, res) {
  const add = new Admin({
    username:req.body.username,
    password:req.body.password
  })
  try{
    if(await Admin.findById(req.body.adminId)){
      const newAdmin =  await add.save()
      res.status(201).json(newAdmin)
    } else {
      res.status(400).send("Not a valid admin id")
    }
     
  }catch(err){
    res.status(400).json({message: err.message}) 
  }
});

//add instructor
router.post('/addInstructor', async function(req, res) {
  const add = new Instructor({
    username:req.body.username,
    password:req.body.password
  })
  try{
    if(await Admin.findById(req.body.adminId)){
      const newInstructor =  await add.save()
      res.status(201).json(newInstructor)
    } else {
      res.status(400).send("Not a valid admin id")
    }
     
  }catch(err){
    res.status(400).json({message: err.message}) 
  }
});

//add corporate trainee
router.post('/addTrainee', async function(req, res) {
  const add = new CorporateTrainee({
    username:req.body.username,
    password:req.body.password,
    corporation:req.body.corporation
  })
  try{
    if(await Admin.findById(req.body.adminId)){
      const newCorporateTrainee =  await add.save()
      res.status(201).json(newCorporateTrainee)
    } else {
      res.status(400).send("Not a valid admin id")
    }
     
  }catch(err){
    res.status(400).json({message: err.message}) 
  }
});

/* Functions */

module.exports = router;