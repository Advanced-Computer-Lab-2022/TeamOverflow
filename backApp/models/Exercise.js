const mongoose = require('mongoose');

var ExerciseSchema = new mongoose.Schema({
    title: {type: String, required: true},
    question: {type: Array, required: true},
    answer: {type: Array, required: true},
}, {timestamps: true});

var Exercise = mongoose.model("Exercise",ExerciseSchema);
module.exports = Exercise;
