const mongoose = require('mongoose')

var instructorSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    country: {type: String, default: "Canada"},
    name: {type: String},
    email: {type: String},
    bio: {type: String},
    rating: {type: Number},
    walletId: {type: mongoose.Types.ObjectId, ref : "Wallet",required : true},
    numberOfRatings: {type: Number, default: 0},
    acceptedContract: {type: Boolean, default: false}
}, {timestamps: true})


var Instructor = mongoose.model("Instructor",instructorSchema);
module.exports = Instructor