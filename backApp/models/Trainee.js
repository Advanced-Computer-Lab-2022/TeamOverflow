const mongoose = require('mongoose')

var traineeSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    country: {type: String},
    name: {type: String},
    email: {type: String}
}, {timestamps})


var Trainee = mongoose.model("Trainee",traineeSchema);
module.exports = Trainee