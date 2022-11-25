const mongoose = require('mongoose');

var ExerciseSchema = new mongoose.Schema({
    
    question: {type: Array, required: true},
    answer: {type: Array, required: true},
    correctIndex: {type: Number, required: true},
}, {timestamps: true});

var Exercise = mongoose.model("Exercise",ExerciseSchema);
module.exports = Exercise;
