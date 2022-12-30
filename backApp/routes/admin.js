var express = require('express');
var router = express.Router();
const Admin = require('../models/Admin')
const Instructor = require('../models/Instructor')
const CorporateTrainee = require('../models/CorporateTrainee')
const { verifyAdmin } = require("../auth/jwt-auth");
const StudentCourses = require('../models/StudentCourses');
const Course = require('../models/Course');
const Subtitle = require('../models/Subtitle');
const Requests = require('../models/Requests');
const Refund = require('../models/Refund');
const bcrypt = require("bcrypt");
const Wallet = require('../models/Wallet');
const { addAmountOwed, transfer } = require('../controllers/walletController');
const moment = require("moment");
const Trainee = require('../models/Trainee');
const Report = require('../models/Report');
const Followup = require('../models/ReportFollowup');
const Notes = require('../models/Notes');
const Answer = require('../models/StudentAnswer');
const { sendGenericEmail } = require('../controllers/mailingController');
const Corporate = require('../models/Corporate');

/* GET admins listing. */
router.get('/', function (req, res) {
  res.send('respond with a resource');

});

//add many users
router.post('/addMany', verifyAdmin, async function (req, res) {
  res.setTimeout(0);
  var message = "All Users Added";
  var errorWith = [];
  try {
    for (let i = 0; i < req.body.instructors.length; i++) {
      var found = (await Admin.findOne({ username: req.body.instructors[i].username })) ||
        (await CorporateTrainee.findOne({ username: req.body.instructors[i].username })) ||
        (await Trainee.findOne({ username: req.body.instructors[i].username })) ||
        (await Instructor.findOne({ username: req.body.instructors[i].username }))

      if (found) {
        message = "Some Users Added"
        errorWith.push(`Username "${req.body.instructors[i].username}" already exists`)
        continue;
      }

      try {
        var wallet = await Wallet.create({})
        var hash = await bcrypt.hash(req.body.instructors[i].password, 10)
        const add = new Instructor({
          username: req.body.instructors[i].username,
          name: req.body.instructors[i].name,
          password: hash,
          email: req.body.instructors[i].email,
          walletId: wallet._id
        })
        const newInstructor = await add.save()
      } catch (err) {
        message = "Some Users Added"
        errorWith.push(`${req.body.instructors[i].username} faced error: ${err.message}`)
      }
    }

    for (let i = 0; i < req.body.admins.length; i++) {
      var found = (await Admin.findOne({ username: req.body.admins[i].username })) ||
        (await CorporateTrainee.findOne({ username: req.body.admins[i].username })) ||
        (await Trainee.findOne({ username: req.body.admins[i].username })) ||
        (await Instructor.findOne({ username: req.body.admins[i].username }))

      if (found) {
        message = "Some Users Added"
        errorWith.push(`Username "${req.body.admins[i].username}" already exists`)
        continue;
      }

      var hash = await bcrypt.hash(req.body.admins[i].password, 10)
      try {
        const add = new Admin({
          username: req.body.admins[i].username,
          password: hash
        })
        const newAdmin = await add.save()
      } catch (err) {
        message = "Some Users Added"
        errorWith.push(`${req.body.instructors[i].username} faced error: ${err.message}`)
      }
    }

    for (let i = 0; i < req.body.trainees.length; i++) {
      var found = (await Admin.findOne({ username: req.body.trainees[i].username })) ||
        (await CorporateTrainee.findOne({ username: req.body.trainees[i].username })) ||
        (await Trainee.findOne({ username: req.body.trainees[i].username })) ||
        (await Instructor.findOne({ username: req.body.trainees[i].username }))

      if (found) {
        message = "Some Users Added"
        errorWith.push(`Username "${req.body.trainees[i].username}" already exists`)
        continue;
      }
      var corporations = await Corporate.findOne({})
      var hash = await bcrypt.hash(req.body.trainees[i].password, 10)
      try {
        const add = new CorporateTrainee({
          username: req.body.trainees[i].username,
          name: req.body.trainees[i].name,
          password: hash,
          email: req.body.trainees[i].email,
          corporation: req.body.trainees[i].corporation
        })
        if(!corporations.corporates.includes(req.body.trainees[i].corporation)){
          var newCorps = [req.body.trainees[i].corporation]
          newCorps.push(corporations.corporates)
          corporations.$set("corporates", newCorps.flat())
          await corporations.save()
        }
        const newCorporateTrainee = await add.save()
      } catch (err) {
        message = "Some Users Added"
        errorWith.push(`${req.body.trainees[i].username} faced error: ${err.message}`)
      }
    }
    res.status(200).json({ message: message, errors: errorWith })
  } catch (err) {
    return res.status(400).json({ message: err.message })
  }
})

//add admin
router.post('/addAdmin', verifyAdmin, async function (req, res) {
  try {
    var found = (await Admin.findOne({ username: req.body.username })) ||
      (await CorporateTrainee.findOne({ username: req.body.username })) ||
      (await Trainee.findOne({ username: req.body.username })) ||
      (await Instructor.findOne({ username: req.body.username }))

    if (found) {
      return res.status(400).json({ message: "Username already exists" })
    }
    var hash = await bcrypt.hash(req.body.password, 10)
    const add = new Admin({
      username: req.body.username,
      password: hash
    })
    const newAdmin = await add.save()
    res.status(201).json(newAdmin)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
});

//add instructor
router.post('/addInstructor', verifyAdmin, async function (req, res) {
  try {
    var found = (await Admin.findOne({ username: req.body.username })) ||
      (await CorporateTrainee.findOne({ username: req.body.username })) ||
      (await Trainee.findOne({ username: req.body.username })) ||
      (await Instructor.findOne({ username: req.body.username }))

    if (found) {
      return res.status(400).json({ message: "Username already exists" })
    }
    var wallet = await Wallet.create({})
    var hash = await bcrypt.hash(req.body.password, 10)
    const add = new Instructor({
      username: req.body.username,
      name: req.body.name,
      password: hash,
      email: req.body.email,
      walletId: wallet._id
    })
    const newInstructor = await add.save()
    res.status(201).json(newInstructor)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
});

//add corporate trainee
router.post('/addTrainee', verifyAdmin, async function (req, res) {
  try {
    var found = (await Admin.findOne({ username: req.body.username })) ||
      (await CorporateTrainee.findOne({ username: req.body.username })) ||
      (await Trainee.findOne({ username: req.body.username })) ||
      (await Instructor.findOne({ username: req.body.username }))

    if (found) {
      return res.status(400).json({ message: "Username already exists" })
    }
    var hash = await bcrypt.hash(req.body.password, 10)
    const add = new CorporateTrainee({
      username: req.body.username,
      name: req.body.name,
      password: hash,
      email: req.body.email,
      corporation: req.body.corporation
    })
    const newCorporateTrainee = await add.save()
    res.status(201).json(newCorporateTrainee)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
});

// a promotion for specific courses, several courses or all courses
router.post('/defineDiscount', verifyAdmin, async function (req, res) {
  try {
    if (moment(req.body.startDate).isBefore(req.body.deadline)) {
      const courses = req.body.courseIds
      for (let i = 0; i < courses.length; i++) {
        await Course.findByIdAndUpdate(courses[i], { $set: { discount: req.body.discount, deadline: req.body.deadline } })
      }
      res.status(200).json({ message: `Discount added to ${courses.length} course(s)` })
    } else {
      res.status(403).json({ message: "Deadline cannot be before start date" })
    }
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

//view course requests from corporate trainees
router.get('/viewRequests', verifyAdmin, async function (req, res) {
  try {
    var results = await Requests.paginate({}, { page: req.query.page, limit: 10, populate: ["courseId", { path: "traineeId", select: { _id: 1, name: 1, email: 1, corporation: 1, username: 1 } }] })
    res.status(200).json({ type: "Course", results: results })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }

});

//Add course access to corporation
router.post('/addAccess', verifyAdmin, async function (req, res) {
  req.setTimeout(0)
  try {
    var users = await CorporateTrainee.find({ corporation: req.body.corporation })
    if (users) {
      const course = await Course.findById(req.body.courseId).populate("instructorId")
      const subtitles = await Subtitle.find({ courseId: req.body.courseId }, { _id: 1, exerciseId: 1, videoId: 1 })
      const itemIds = [course.examId?.toString(), course.videoId?.toString(), subtitles.map((sub) => [sub.exerciseId?.toString(), sub.videoId?.toString()])].flat().flat()
      var completion = {}
      for (let i = 0; i < itemIds.length; i++) {
        if (itemIds[i]) {
          completion[itemIds[i]] = false
        }
      }
      var courseSubtotal = course.discount && moment().isAfter(course.startDate) && moment().isBefore(course.deadline) ? course.price * ((100 - course.discount) / 100) : course.price
      users.map(async (user) => {
        if (!(await StudentCourses.findOne({ traineeId: user._id, courseId: course._id }))) {
          const traineeCourse = new StudentCourses({
            traineeId: user._id,
            courseId: req.body.courseId,
            completion: completion
          });
          await addAmountOwed(user._id, course, courseSubtotal)
          await traineeCourse.save();
          course.$inc("enrolled", 1)
          await course.save()
        }
      })
      res.status(200).json({ message: `Access to "${course.title}" granted to ${req.body.corporation}` })
    } else {
      res.status(400).json({ message: "No users in this corporation" })
    }
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
});

//grant access for corporate-trainee to a course
router.post('/grantAccess', verifyAdmin, async function (req, res) {
  try {
    var request = await Requests.findById(req.body.requestId).populate([{ path: "traineeId", select: { _id: 1, name: 1, email: 1, corporation: 1, username: 1 } }])
    if (!(await StudentCourses.findOne({ traineeId: request.traineeId, courseId: request.courseId }))) {
      const course = await Course.findById(request.courseId).populate("instructorId")
      const subtitles = await Subtitle.find({ courseId: request.courseId }, { _id: 1, exerciseId: 1, videoId: 1 })
      const itemIds = [course.examId?.toString(), course.videoId?.toString(), subtitles.map((sub) => [sub.exerciseId?.toString(), sub.videoId?.toString()])].flat().flat()
      var completion = {}
      for (let i = 0; i < itemIds.length; i++) {
        if (itemIds[i]) {
          completion[itemIds[i]] = false
        }
      }
      var courseSubtotal = course.discount && moment().isAfter(course.startDate) && moment().isBefore(course.deadline) ? course.price * ((100 - course.discount) / 100) : course.price
      const traineeCourse = new StudentCourses({
        traineeId: request.traineeId,
        courseId: request.courseId,
        completion: completion
      });
      await addAmountOwed(request.traineeId._id, course, courseSubtotal)
      const newTraineeCourse = await traineeCourse.save();
      course.$inc("enrolled", 1)
      await course.save()
      await request.delete()
      const content = `
        <h1>Hello ${request.traineeId.name} !</h1>
        <p>Your request to access the course "${course.title}" has been accepted</p><br/>
        <p>Start learning now!</p>
      `
      await sendGenericEmail(request.traineeId.email, "Request Accepted", content)
      var results = await Requests.paginate({}, { page: req.query.page, limit: 10, populate: ["courseId", { path: "traineeId", select: { _id: 1, name: 1, email: 1, corporation: 1, username: 1 } }] })
      res.status(200).json({ type: "Course", results: results })
    } else {
      res.status(400).json({ message: "Trainee already registered to this course" })
    }
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
});

//Reject access for corporate-trainee to a course
router.post('/rejectAccess', verifyAdmin, async function (req, res) {
  try {
    var request = await Requests.findById(req.body.requestId).populate([{ path: "traineeId", select: { _id: 1, name: 1, email: 1, corporation: 1, username: 1 } }])
    if (request) {
      const course = await Course.findById(request.courseId)
      await request.delete()
      const content = `
        <h1>Hello ${request.traineeId.name} !</h1>
        <p>Sadly, your request to access the course "${course.title}" has been rejected</p><br/>
        <p>Feel free to apply again</p>
      `
      await sendGenericEmail(request.traineeId.email, "Request Rejected", content)
      var results = await Requests.paginate({}, { page: req.query.page, limit: 10, populate: ["courseId", { path: "traineeId", select: { _id: 1, name: 1, email: 1, corporation: 1, username: 1 } }] })
      res.status(200).json({ type: "Course", results: results })
    } else {
      res.status(404).json({ message: "Request Not Found" })
    }
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
});

//view refund requests from trainees
router.get('/viewRefunds', verifyAdmin, async function (req, res) {
  try {
    var results = await Refund.paginate({}, { page: req.query.page, limit: 10, populate: ["registrationId", { path: "instructorId", select: { _id: 1, name: 1, email: 1 } }, { path: "traineeId", select: { _id: 1, name: 1, email: 1, username: 1 } }] })
    for (let i = 0; i < results.docs.length; i++) {
      results.docs[i].registrationId = await results.docs[i].registrationId.populate("courseId")
    }
    res.status(200).json({ type: "Refund", results: results })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

//refund an amount to a trainee to their wallet
router.post('/refundTraniee', verifyAdmin, async function (req, res) {
  try {
    var refund = await Refund.findById(req.body.refundId).populate(["traineeId", "instructorId", "registrationId"])
    if (refund) {
      var reg = await StudentCourses.findById(refund.registrationId._id)
      await transfer(refund.instructorId, refund.traineeId, reg.courseId, refund.registrationId.amountPaid)
      var course = await Course.findById(reg.courseId)
      var subtitles = await Subtitle.find({ courseId: reg.courseId })
      var exams = [course.examId]
      var videos = [course.videoId]
      subtitles.map((sub) => { exams.push(sub.exerciseId); videos.push(sub.videoId) })
      await Notes.deleteMany({ videoId: { $in: videos }, traineeId: refund.traineeId._id })
      await Answer.deleteMany({ exerciseId: { $in: exams }, traineeId: refund.traineeId._id })
      await reg.delete()
      await refund.delete()
      course.$inc("enrolled", -1)
      await course.save()
      const content = `
      <h1>Hello ${refund.traineeId.name} !</h1>
      <p>Your request to refund the course "${course.title}" has been accepted</p><br/>
      <p>USD ${reg.amountPaid} has been added to your wallet</p>
    `
      await sendGenericEmail(refund.traineeId.email, "Refund Accepted", content)
      var results = await Refund.paginate({}, { page: req.body.page, limit: 10, populate: ["registrationId", { path: "instructorId", select: { _id: 1, name: 1, email: 1 } }, { path: "traineeId", select: { _id: 1, name: 1, email: 1, username: 1 } }] })
      for (let i = 0; i < results.docs.length; i++) {
        results.docs[i].registrationId = await results.docs[i].registrationId.populate("courseId")
      }
      res.status(200).json({ type: "Refund", results: results })
    } else {
      res.status(403).json({ message: "Refund request not found" })
    }
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

//reject refund
router.post('/rejectRefund', verifyAdmin, async function (req, res) {
  try {
    var refund = await Refund.findById(req.body.refundId).populate(["traineeId", "instructorId"])
    if (refund) {
      await refund.delete()
      var reg = await StudentCourses.findByIdAndUpdate(refund.registrationId, { onHold: false }, { new: true }).populate("courseId")
      const content = `
      <h1>Hello ${refund?.traineeId?.name} !</h1>
      <p>Sadly, your request to refund the course "${reg?.courseId?.title}" has been rejected</p><br/>
      <p>Feel free to request a refund again and try emailing your instructor</p>
    `
      await sendGenericEmail(refund.traineeId.email, "Refund Rejected", content)
      var results = await Refund.paginate({}, { page: req.body.page, limit: 10, populate: ["registrationId", { path: "instructorId", select: { _id: 1, name: 1, email: 1 } }, { path: "traineeId", select: { _id: 1, name: 1, email: 1, username: 1 } }] })
      for (let i = 0; i < results.docs.length; i++) {
        results.docs[i].registrationId = await results.docs[i].registrationId.populate("courseId")
      }
      res.status(200).json({ type: "Refund", results: results })
    } else {
      res.status(404).json({ message: "Refund request not found" })
    }
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

//view users reported problems
router.get('/viewReports', verifyAdmin, async function (req, res) {
  try {
    const status = req.query.status || { $regex: ".*" }
    const type = req.query.type || { $regex: ".*" }
    var results = await Report.paginate({ status: status, type: type }, { page: req.query.page, limit: 10 })
    res.status(200).json(results)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

//view one reported problem with followups
router.get('/viewFollowups', verifyAdmin, async function (req, res) {
  try {
    var result = await Report.findById(req.query.reportId)
    var report = result.toJSON()
    switch (report.userRef) {
      case "Trainee": report.userId = await Trainee.findById(report.userId, { _id: 1, name: 1, email: 1 }); break;
      case "CorporateTrainee": report.userId = await CorporateTrainee.findById(report.userId, { _id: 1, name: 1, email: 1 }); break;
      case "Instructor": report.userId = await Instructor.findById(report.userId, { _id: 1, name: 1, email: 1 }); break;
    }
    var followups = await Followup.find({ reportId: req.query.reportId })
    res.status(200).json({ report: report, followups: followups })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

//respond to a report
router.post('/respondReport', verifyAdmin, async function (req, res) {
  try {
    var result = await Report.findByIdAndUpdate(req.body.reportId, { $set: { status: req.body.status } }, { new: true })
    var report = result.toJSON()
    switch (report.userRef) {
      case "Trainee": report.userId = await Trainee.findById(report.userId, { _id: 1, name: 1, email: 1 }); break;
      case "CorporateTrainee": report.userId = await CorporateTrainee.findById(report.userId, { _id: 1, name: 1, email: 1 }); break;
      case "Instructor": report.userId = await Instructor.findById(report.userId, { _id: 1, name: 1, email: 1 }); break;
    }
    res.status(200).json(report)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.put("/edit", verifyAdmin, async (req, res) => {
  try {
    var update = {
      name: req.body.name ? req.body.name : undefined,
      email: req.body.email ? req.body.email : undefined,
    }
    console.log(update)
    var user = await Admin.findByIdAndUpdate(req.reqId, update, { new: true }).select({ password: 0 });
    return res.status(200).json(user)
  } catch (err) {
    return res.status(400).json({ message: "Edit Failed" })
  }
})




/* Functions */

module.exports = router;