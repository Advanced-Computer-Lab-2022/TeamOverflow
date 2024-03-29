const mongoose = require('mongoose')

var corptrainSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    corporation: {type: String, required: true},
    country: {type: String},
    name: {type: String, required: true},
    email: {type: String, required: true},
    acceptedTerms: {type: Boolean, default: false},
    bearer: {type: String, default: "Corporate"}
}, {timestamps: true})

var CorporateTrainee = mongoose.model("CorporateTrainee",corptrainSchema);
module.exports = CorporateTrainee