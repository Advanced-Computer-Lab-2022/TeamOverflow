const mongoose = require('mongoose')

var subtitleSchema = new mongoose.Schema({
    title: {type: String, required: true},
    time: {type: Number, required: true},
    courseId: {type: mongoose.Types.ObjectId, ref:"Course" ,required: true},
    videoId: {type: mongoose.Types.ObjectId, ref:"Video" ,required: true},
    exerciseId: {type: mongoose.Types.ObjectId, ref:"Exercise" ,required: true}
}, {timestamps: true})

var Subtitle = mongoose.model("Subtitle",subtitleSchema);
module.exports = Subtitle