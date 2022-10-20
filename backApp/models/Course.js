const mongoose = require('mongoose')

var courseSchema = new mongoose.Schema({
    title: String,
    subtitle: String,
    subject: String,
    summary: String,
    instructorId: Number,
})

var Course = mongoose.model("Course",courseSchema);
module.exports(Course)