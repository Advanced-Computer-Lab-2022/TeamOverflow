const mongoose = require('mongoose')

var instructorSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    country: {type: String},
    name: {type: String},
    email: {type: String}
}, {timestamps})


var Instructor = mongoose.model("Instructor",instructorSchema);
module.exports = Instructor