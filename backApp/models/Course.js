const mongoose = require('mongoose')

var courseSchema = new mongoose.Schema({
    title: {type: String, required: true},
    subject: {type: String, required: true},
    summary: {type: String, required: true},
    price: {type: Number, required: true},
    discount: {type: Number, required: true},
    instructorId: {type: mongoose.Types.ObjectId, ref:"Instructor" ,required: true},
    rating: {type: Number},
    totalHours: {type: Number, required: true}
})

var Course = mongoose.model("Course",courseSchema);
module.exports = Course