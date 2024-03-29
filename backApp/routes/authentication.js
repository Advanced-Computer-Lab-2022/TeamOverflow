const express = require('express');
const router = express.Router();
const nodemailer = require("nodemailer")
const CorporateTrainee = require("../models/CorporateTrainee");
const Trainee = require("../models/Trainee");
const Instructor = require("../models/Instructor");
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const { verifyAllUsersCorp } = require("../auth/jwt-auth")
const bcrypt = require("bcrypt")
const fs = require("fs")
const path = require("path");
const { transporter } = require('../controllers/mailingController');

router.get("/TandC", async (req, res) => {
  try {
    var filepath = path.join(__dirname, '../', 'public', 'markdown', 'terms.md');
    var file = fs.readFileSync(filepath, 'utf8');
    res.status(200).send(file.toString());
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: err })
  }
})

router.get("/forgotPassword", async (req, res) => {
  try {
    var user = (await Instructor.findOne({ username: req.query.username, email: req.query.email }) || await CorporateTrainee.findOne({ username: req.username, email: req.email }) || await Trainee.findOne({ username: req.username, email: req.email }))
    if (user) {
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
    try {
      var hash = await bcrypt.hash(req.body.password, 10)
      var user = (await Instructor.findByIdAndUpdate(decoded._id, { password: hash }) || await CorporateTrainee.findByIdAndUpdate(decoded._id, { password: hash }) || await Trainee.findByIdAndUpdate(decoded._id, { password: hash }));
      res.status(200).json({ messsage: "Password Changed" });
    } catch (err) {
      res.status(400).json({ messsage: err });
    }
  })
})

router.put("/changePassword", verifyAllUsersCorp, async (req, res) => {
  try {
    var user = (await Instructor.findById(req.reqId)) || (await CorporateTrainee.findById(req.reqId)) || (await Trainee.findById(req.reqId))
    if (user && await bcrypt.compare(req.body.prevPassword, user.password)) {
      var hash = await bcrypt.hash(req.body.password, 10)
      user.$set({ password: hash })
      await user.save()
      return res.status(200).json(user);
    }
    return res.status(400).json({ messsage: "Previous password is incorrect" });
  } catch (err) {
    res.status(400).json({ messsage: err });
  }
})

router.post("/login", async (req, res) => {
  try {
    const loginData = req.body
    const user = (await Admin.findOne({ username: loginData.username })) ||
      (await CorporateTrainee.findOne({ username: loginData.username })) ||
      (await Trainee.findOne({ username: loginData.username })) ||
      (await Instructor.findOne({ username: loginData.username }))
    if (user && await bcrypt.compare(loginData.password, user.password)) {
      const payload = user.toJSON()
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        //{expiresIn: 86400},
        (err, token) => {
          if (err) return res.json({ message: err })
          return res.status(200).json({ message: "Success", payload: payload, token: `${user.bearer} ${token}` })
        }
      )
    } else {
      return res.status(400).json({ message: "Invalid username or password" })
    }
  } catch (err) {
    return res.status(400).json({ message: err.message })
  }
})

/* Functions */
async function sendEmail(user, res) {
  const payload = user.toJSON()
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