const mongoose = require('mongoose');

var AnswerSchema = new mongoose.Schema({
    answer: {type: Array, required: true},
    traineeId: {type: mongoose.Types.ObjectId, ref:"Student" ,required: true},
    exerciseId: {type: mongoose.Types.ObjectId, ref:"Exercise" ,required: true},
    courseId: {type: mongoose.Types.ObjectId, ref:"Course" ,required: true}
}, {timestamps: true});

var Answer = mongoose.model("Answer",AnswerSchema);
module.exports = Answer;
