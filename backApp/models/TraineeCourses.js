const mongoose = require('mongoose')
var traineeCoursesSchema = new mongoose.Schema({
    traineeId: {type: mongoose.Types.ObjectId, ref:"Trainee", required: true},
    courseId: {type: mongoose.Types.ObjectId, ref:"Course", required: true}
}, {timestamps: true})


var TraineeCourses = mongoose.model("TraineeCourses",traineeCoursesSchema);
module.exports = TraineeCourses