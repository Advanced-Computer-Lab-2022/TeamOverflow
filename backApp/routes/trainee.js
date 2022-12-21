//const bcrypt = require("bcryptjs");
var express = require('express');
var router = express.Router();
const Trainee = require("../models/Trainee");
const StudentCourses = require("../models/StudentCourses");
const CourseRating = require("../models/CourseRating");
const InstructorRating = require("../models/InstructorRating");
const Course = require("../models/Course");
const Instructor = require("../models/Instructor");
const Exercise = require("../models/Exercise");
const Answer = require("../models/StudentAnswer");
const Video = require("../models/Video");
const jwt = require("jsonwebtoken");
const { verifyAllUsersCorp, verifyTrainee } = require('../auth/jwt-auth');
const { submitSolution, getGrade, openExercise, watchVideo, getRegistered, openCourse, getProgress, addNote } = require('../controllers/studentController');
const mongoose = require("mongoose");
const { processPayment, getPaymentLink, verifyPayment } = require('../controllers/paymentController');
const Subtitle = require('../models/Subtitle');
const bcrypt = require('bcrypt');
const Wallet = require('../models/Wallet');
const { addAmountOwed } = require('../controllers/walletController');

/* GET trainees listing. */
router.get('/', async function (req, res) {
  users = await Trainee.find();
  res.send(users);

});

//Trainee Signup
router.post("/signup", async (req, res) => {
  const { username, name, email, gender, acceptedTerms, country, password } = req.body
  try {
    var hash = await bcrypt.hash(password, 10)
    var wallet = await Wallet.create({})
    const newUser = new Trainee({
      username: username,
      name: name,
      email: email,
      gender: gender,
      acceptedTerms: acceptedTerms,
      country: country,
      password: hash,
      walletId: wallet._id
    });

    await newUser.save();
    res.status(201).json({ message: "User Created" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
})

//Trainee Login
router.post("/login", async (req, res) => {
  try {
    const traineeLogin = req.body
    await Trainee.findOne({ username: traineeLogin.username }).populate("walletId").then(async (trainee) => {
      if (trainee && await bcrypt.compare(traineeLogin.password, trainee.password)) {
        const payload = trainee.toJSON()
        jwt.sign(
          payload,
          process.env.JWT_SECRET,
          //{expiresIn: 86400},
          (err, token) => {
            if (err) return res.json({ message: err })
            return res.status(200).json({ message: "Success", payload: payload, token: "Trainee " + token })
          }
        )
      } else {
        return res.status(400).json({ message: "Invalid username or password" })
      }
    })
  } catch(err){
    return res.status(400).json({ message: err.message })
  }
})

router.post("/selectCountry", verifyAllUsersCorp, async (req, res) => {
  try {
    await Trainee.updateOne({ _id: req.reqId }, { country: req.body.country })
    var user = await Trainee.findById(req.reqId)
    return res.status(200).json(user)
  } catch (err) {
    return res.status(400).json({ message: "Update Failed" })
  }
})

router.put("/edit", verifyTrainee, async (req, res) => {
  try {
    var update = {
      name: req.body.name ? req.body.name : undefined,
      email: req.body.email ? req.body.email : undefined,
      country: req.body.country ? req.body.country : undefined
    }
    console.log(update)
    var user = await Trainee.findByIdAndUpdate(req.reqId, update, {new: true}).select({password: 0});
    return res.status(200).json(user)
  } catch (err) {
    return res.status(400).json({ message: "Edit Failed" })
  }
})
module.exports = router;


router.get('/checkOut', verifyTrainee, async function (req, res) {
  try {
    const course = await Course.findById(req.body.courseId)
    const user = await Trainee.findById(req.reqId)
    const alreadyRegistered = await StudentCourses.findOne({ courseId: req.body.courseId, traineeId: req.reqId })
    if (alreadyRegistered) {
      return res.status(400).json({ message: "You are already registered to this course" })
    }
    await getPaymentLink(req, res, course)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}
)

//register trainee to a course
router.post('/registerCourse', verifyTrainee, async function (req, res) {
  try {
    const course = await Course.findById(req.body.courseId).populate("instructorId")
    const user = await Trainee.findById(req.reqId)
    const alreadyRegistered = await StudentCourses.findOne({ courseId: req.body.courseId, traineeId: req.reqId })
    if (alreadyRegistered) {
      return res.status(400).json({ message: "You are already registered to this course" })
    }
    const subtitles = await Subtitle.find({ courseId: req.body.courseId }, { _id: 1, exerciseId: 1, videoId: 1 })
    const itemIds = [course.examId?.toString(), course.videoId?.toString(), subtitles.map((sub) => [sub.exerciseId?.toString(), sub.videoId?.toString()])].flat().flat()
    var completion = {}
    for (let i = 0; i < itemIds.length; i++) {
      if (itemIds[i]) {
        completion[itemIds[i]] = false
      }
    }
    const traineeCourse = new StudentCourses({
      traineeId: req.reqId,
      courseId: req.body.courseId,
      completion: completion
    });
    const paymentSession = await verifyPayment(req, res)
    if (paymentSession.payment_status === "paid") {
      await addAmountOwed(course.instructorId.walletId, paymentSession.amount_subtotal/100, paymentSession.currency.toUpperCase())
      const newTraineeCourse = await traineeCourse.save();
      course.$inc("enrolled", 1)
      await course.save()
      res.status(201).json(newTraineeCourse)
    }
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
});

//submit the answers to the exercise after completing it
router.post('/submitSolution', verifyTrainee, async function (req, res) {
  try {
    const regCourse = await StudentCourses.findOne({ courseId: req.body.courseId, traineeId: req.reqId })
    if (regCourse) {
      await submitSolution(req, res, regCourse);
    } else {
      res.status(403).json({ message: "You are not registered to this course" })
    }
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
});

//delete student answer
router.delete('/deleteAnswer', verifyTrainee, async function (req, res) {
  var course = await Course.findById(req.body.courseId);
  var trainee = await Trainee.findById(req.body.traineeId);
  var exercise = await Exercise.findById(req.body.exerciseId);
  var answer = await Answer.findOne({ traineeId: trainee, courseId: course, exerciseId: exercise });
  try {
    await answer.deleteOne();
    res.status(200).json({ message: "Deleted Successfully" })
  }
  catch (err) {
    res.status(400).json({ message: err.message })
  }

});


//view his/her grade from the exercise
router.get('/viewGrade', verifyTrainee, async function (req, res) {
  await getGrade(req, res);
});



//view the questions with the correct solution to view the incorrect answers
router.get('/viewExercise', verifyTrainee, async function (req, res) {
  await openExercise(req, res);
});

router.get('/openCourse', verifyTrainee, async function (req, res) {
  try {
    if (await StudentCourses.findOne({ courseId: req.query.courseId, traineeId: req.reqId })) {
      await openCourse(req, res)
    } else {
      res.status(403).json({ message: "You are not registered to this course" })
    }
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
});

router.get('/getRegisteredCourses', verifyTrainee, async function (req, res) {
  await getRegistered(req, res);
});

//watch a video from a course he/she is registered for
router.get('/watchVideo', verifyTrainee, async function (req, res) {
  try {
    const regCourse = await StudentCourses.findOne({ courseId: req.query.courseId, traineeId: req.reqId })
    if (regCourse) {
      await watchVideo(req, res, regCourse)
    } else {
      res.status(403).json({ message: "You are not registered to this course" })
    }
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
});

//Add note to video
router.post('/addNote', verifyTrainee, async function (req, res) {
  await addNote(req, res);
});

//get progress of a course he/she is registered for
router.get('/getProgress', verifyTrainee, async function (req, res) {
  try {
    const regCourse = await StudentCourses.findOne({ courseId: req.query.courseId, traineeId: req.reqId })
    if (regCourse) {
      await getProgress(req, res, regCourse)
    } else {
      res.status(403).json({ message: "You are not registered to this course" })
    }
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
});

//download certificate as a pdf 
router.get('/downloadCertificate', verifyTrainee, async function (req, res) {
  try {
    const regCourse = await StudentCourses.findOne({ courseId: req.query.courseId, traineeId: req.reqId })
    if (regCourse) {
      await downloadCertificate(req, res, regCourse)
    } else {
      res.status(403).json({ message: "You are not registered to this course" })
    }
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
});

//download notes as a pdf 
router.get('/downloadNotes', verifyTrainee, async function (req, res) {
  try {
    const regCourse = await StudentCourses.findOne({ courseId: req.query.courseId, traineeId: req.reqId })
    if (regCourse) {
      await downloadNotes(req, res, regCourse)
    } else {
      res.status(403).json({ message: "You are not registered to this course" })
    }
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
});

//report problem with course
router.post('/reportProblem', verifyTrainee, async function (req, res) {
  await reportProblem(req, res);
});

//view the amount available in their wallet from refunded courses
router.get('/wallet', verifyTrainee, async function (req, res) {
  try {
    var result = await Wallet.findOne({id: req.reqId})
    res.status(200).json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

/* Functions */

module.exports = router;
