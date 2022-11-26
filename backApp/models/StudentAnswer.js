const mongoose = require('mongoose');

var AnswerSchema = new mongoose.Schema({
    answers: [{type: Number, required: true}],
    traineeId: {type: mongoose.Types.ObjectId, required: true},
    exerciseId: {type: mongoose.Types.ObjectId, ref:"Exercise" ,required: true},
    grade: {type: Number},
}, {timestamps: true});

var Answer = mongoose.model("Answer",AnswerSchema);
module.exports = Answer;
