const mongoose = require('mongoose')

var subtitleSchema = new mongoose.Schema({
    title: {type: String, required: true},
    time: {type: Array, required: true},
    exercises: {type: Array, required: true},
    courseId: {type: String, required: true}
})

var Subtitle = mongoose.model("Subtitle",subtitleSchema);
module.exports = Subtitle