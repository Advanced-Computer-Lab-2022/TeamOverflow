const mongoose = require('mongoose')

var courseRateSchema = new mongoose.Schema({
    rating: {type: Number, required: true},
    review: {type: String},
    courseId: {type: mongoose.Types.ObjectId, ref:"Course" , required: true},
    userId: {type: mongoose.Types.ObjectId, required: true},
}, {timestamps})

var CourseRating = mongoose.model("CourseRating",courseRateSchema);
module.exports = CourseRating