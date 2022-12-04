const express = require('express');
const router = express.Router();
const nodemailer = require("nodemailer")
const CorporateTrainee = require("../models/CorporateTrainee");
const Trainee = require("../models/Trainee");
const Instructor = require("../models/Instructor");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

/* Mail Setup*/
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

router.get("/forgotPassword", async (req, res) => {
  try {
    var user = (await Instructor.findOne({ username: req.query.username, email: req.query.email }) || await CorporateTrainee.findOne({ username: req.username, email: req.email }) || await Trainee.findOne({ username: req.username, email: req.email }))
    if(user) {
      await sendEmail(user, res);
    } else {
      res.status(404).json({ message: "User not found" })
    }
  } catch (err) {
    res.status(400).json({ message: err })
  }
})

router.put("/resetPassword", async (req, res) => {
  jwt.verify(req.body.token, process.env.PASSPORTSECRET, async (err, decoded) => {
    try{
      var user = (await Instructor.findByIdAndUpdate(decoded._id, {password: req.body.password}) || await CorporateTrainee.findByIdAndUpdate(decoded._id, {password: req.body.password}) || await Trainee.findByIdAndUpdate(decoded._id, {password: req.body.password}));
      res.status(200).json({messsage: "Password Changed"});
    } catch(err){
      res.status(400).json({messsage: err});
    }
  })
})

/* Functions */
async function sendEmail(user, res) {
  const payload = JSON.parse(JSON.stringify(user))
  var token;
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "10 minutes" }, async (err, token) => {
    var mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Password Reset Request",
      html: "<h1>Hello " + user?.name + "!</h1>" +
        "<p>Have you requested to reset your password? Follow this link and reset your password within 10 minutes</p><br/>" +
        "<a href=\"" + process.env.BASE + "/reset-password/" + token + "\">Click Here</a><br/>" +
        "<p>If that doesn't work follow this link: " + process.env.BASE + "/reset-password/" + token + "</p><br/" +
        "<p>Not you? Ignore this email and secure your password</p>"
    };
    await transporter.sendMail(mailOptions).then(
      res.status(200).json({ message: "Mail Sent" })
    ).catch((err) => {
      console.log(err)
      res.status(400).json({ message: err })
    });
  });
}

module.exports = router