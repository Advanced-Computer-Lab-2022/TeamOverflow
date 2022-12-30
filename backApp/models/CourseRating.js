const mongoose = require('mongoose')
const paginate = require("mongoose-paginate")

var courseRateSchema = new mongoose.Schema({
    rating: {type: Number, required: true},
    review: {type: String},
    courseId: {type: mongoose.Types.ObjectId, ref:"Course" , required: true},
    instructorId: {type: mongoose.Types.ObjectId, ref:"Instructor" , required: true},
    userId: {type: mongoose.Types.ObjectId, required: true},
}, {timestamps: true})

courseRateSchema.plugin(paginate)
var CourseRating = mongoose.model("CourseRating",courseRateSchema);
module.exports = CourseRating