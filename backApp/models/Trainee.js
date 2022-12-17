const mongoose = require('mongoose')

var traineeSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    corporation: {type: String, required: true},
    country: {type: String},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    gender: {type: String, required: true},
    acceptedTerms: {type: Boolean, required: true},
    walletId: {type: mongoose.Types.ObjectId, required: true}
}, {timestamps: true})


var Trainee = mongoose.model("Trainee",traineeSchema);
module.exports = Trainee