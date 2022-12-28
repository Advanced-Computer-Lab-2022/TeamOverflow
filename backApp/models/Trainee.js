const mongoose = require('mongoose')

var traineeSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    country: {type: String, required: true},
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    gender: {type: String},
    acceptedTerms: {type: Boolean, required: true},
    walletId: {type: mongoose.Types.ObjectId, ref: "Wallet", required: true}
}, {timestamps: true})


var Trainee = mongoose.model("Trainee",traineeSchema);
module.exports = Trainee 