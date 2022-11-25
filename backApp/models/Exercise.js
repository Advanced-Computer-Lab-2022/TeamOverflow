const mongoose = require('mongoose');

var ExerciseSchema = new mongoose.Schema({   
    questions: [{type: String, required: true}],
    choices: [{type: Array, required: true}],
    correctIndecies: [{type: Number, required: true}],
}, {timestamps: true});

var Exercise = mongoose.model("Exercise",ExerciseSchema);
module.exports = Exercise;
