const mongoose = require('mongoose')

var subtitleSchema = new mongoose.Schema({
    title: {type: String, required: true},
    time: {type: Number, default: 0},
    courseId: {type: mongoose.Types.ObjectId, ref:"Course" ,required: true},
    videoId: {type: mongoose.Types.ObjectId, ref:"Video"},
    exerciseId: {type: mongoose.Types.ObjectId, ref:"Exercise"}
}, {timestamps: true})

var Subtitle = mongoose.model("Subtitle",subtitleSchema);
module.exports = Subtitle