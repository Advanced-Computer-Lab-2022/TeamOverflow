const mongoose = require('mongoose')

var corptrainSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    corporation: {type: String, required: true},
    country: {type: String},
    name: {type: String},
    email: {type: String},
    bearer: {type: String, default: "Corporate"}
}, {timestamps: true})

var CorporateTrainee = mongoose.model("CorporateTrainee",corptrainSchema);
module.exports = CorporateTrainee