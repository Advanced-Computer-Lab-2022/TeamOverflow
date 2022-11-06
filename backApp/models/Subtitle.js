const mongoose = require('mongoose')

var subtitleSchema = new mongoose.Schema({
    title: {type: String, required: true},
    time: {type: Number, required: true},
    exercises: {type: Array, required: true},
    courseId: {type: mongoose.Types.ObjectId, ref:"Course" ,required: true},
}, {timestamps: true})

var Subtitle = mongoose.model("Subtitle",subtitleSchema);
module.exports = Subtitle