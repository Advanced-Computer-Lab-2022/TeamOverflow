const mongoose = require('mongoose')

var instructorRateSchema = new mongoose.Schema({
    rating: {type: Number, required: true},
    review: {type: String},
    instructorId: {type: mongoose.Types.ObjectId, ref:"Instructor" , required: true},
    userId: {type: mongoose.Types.ObjectId, required: true},
})

var InstructorRating = mongoose.model("InstructorRating",instructorRateSchema);
module.exports = InstructorRating