var express = require('express');
var router = express.Router();
var CorporateTrainee = require("../models/CorporateTrainee")
const jwt = require("jsonwebtoken");

/* GET corporate trainees listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');

});

//Corporate Trainee Login
router.post("/login", async (req,res) => {
  const traineeLogin = req.body
  await Trainee.findOne({username: traineeLogin.username, password: traineeLogin.password}).then( trainee => {
    if(trainee) {
      const payload = JSON.parse(JSON.stringify(trainee))
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {expiresIn: 86400},
        (err, token) => {
          if(err) return res.json({message: err})
          return res.status(200).json({message: "Success", token: "Corporate "+token})
        }
      )
    } else {
      return res.json({message: "Invalid username or password"})
    }
  })
})

/* Functions */

module.exports = router;
