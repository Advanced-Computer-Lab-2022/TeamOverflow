const mongoose = require('mongoose')
var traineeCoursesSchema = new mongoose.Schema({
    traineeId: {type: mongoose.Types.ObjectId, required: true},
    courseId: {type: mongoose.Types.ObjectId, ref:"Course", required: true}
}, {timestamps: true})


var StudentCourses = mongoose.model("StudentCourses",traineeCoursesSchema);
module.exports = StudentCourses