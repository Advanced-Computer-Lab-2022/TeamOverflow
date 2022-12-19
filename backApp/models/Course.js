const mongoose = require('mongoose')

var courseSchema = new mongoose.Schema({
    title: {type: String, required: true},
    subject: {type: String, required: true},
    summary: {type: String, required: true},
    price: {type: Number, required: true},
    discount: {type: Number},
    deadline: {type: Date},
    instructorId: {type: mongoose.Types.ObjectId, ref:"Instructor" ,required: true},
    rating: {type: Number},
    numberOfRatings: {type: Number, default: 0},
    totalHours: {type: Number, required: true},
    certificate: {type: String},
    notes: {type: String},
    videoId: {type: mongoose.Types.ObjectId, ref:"Video"},
    examId: {type: mongoose.Types.ObjectId, ref:"Exercise" },
    enrolled: {type: Number, default: 0}
}, {timestamps: true})

var Course = mongoose.model("Course",courseSchema);
module.exports = Course