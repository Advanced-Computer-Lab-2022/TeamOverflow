const mongoose = require('mongoose');
const paginate = require("mongoose-paginate");

var traineeCoursesSchema = new mongoose.Schema({
    traineeId: {type: mongoose.Types.ObjectId, required: true},
    courseId: {type: mongoose.Types.ObjectId, ref:"Course", required: true},
    completion: {type: JSON, required: true}
}, {timestamps: true})

traineeCoursesSchema.plugin(paginate)
var StudentCourses = mongoose.model("StudentCourses",traineeCoursesSchema);
module.exports = StudentCourses