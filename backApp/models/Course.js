const mongoose = require('mongoose')
var paginate = require("mongoose-paginate");

var courseSchema = new mongoose.Schema({
    title: {type: String, required: true},
    subject: {type: String, required: true},
    summary: {type: String, required: true},
    price: {type: Number, required: true},
    discount: {type: Number},
    deadline: {type: Date},
    instructorId: {type: mongoose.Types.ObjectId, ref:"Instructor" ,required: true},
    rating: {type: Number, default: 5},
    numberOfRatings: {type: Number, default: 0},
    totalHours: {type: Number, required: true},
    certificate: {type: String},
    videoId: {type: mongoose.Types.ObjectId, ref:"Video"},
    examId: {type: mongoose.Types.ObjectId, ref:"Exercise" },
    published: {type: Boolean, default: false},
    closed: {type: Boolean, default: false},
    enrolled: {type: Number, default: 0}
}, {timestamps: true})

courseSchema.plugin(paginate);
var Course = mongoose.model("Course",courseSchema);
module.exports = Course