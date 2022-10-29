var express = require('express');
var router = express.Router();
var CorporateTrainee = require("../models/CorporateTrainee")
const jwt = require("jsonwebtoken");
const { verifyAllUsersCorp } = require('../auth/jwt-auth');

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

/* Functions */


module.exports = router;
