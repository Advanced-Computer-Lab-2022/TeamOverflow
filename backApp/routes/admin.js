var express = require('express');
var router = express.Router();
const Admin= require('../models/Admin')
const Instructor= require('../models/Instructor')
const CorporateTrainee= require('../models/CorporateTrainee')
const jwt = require("jsonwebtoken");
const {verifyAdmin} = require("../auth/jwt-auth")

/* GET admins listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');

});

//Admin Login
router.post("/login", async (req,res) => {
  const adminLogin = req.body
  await Admin.findOne({username: adminLogin.username, password: adminLogin.password}).then( admin => {
    if(admin) {
      const payload = JSON.parse(JSON.stringify(admin))
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {expiresIn: 86400},
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

//add corporate trainee
router.post('/addTrainee', verifyAdmin, async function(req, res) {
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

/* Functions */

module.exports = router;