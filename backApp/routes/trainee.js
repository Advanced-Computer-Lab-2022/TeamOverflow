var express = require('express');
var router = express.Router();
var Trainee = require("../models/Trainee")
const jwt = require("jsonwebtoken");

/* GET trainees listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');

});

//Trainee Login
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
          return res.status(200).json({message: "Success", token: "Trainee "+token})
        }
      )
    } else {
      return res.json({message: "Invalid username or password"})
    }
  })
})

/* Functions */

module.exports = router;
