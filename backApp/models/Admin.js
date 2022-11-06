const mongoose = require('mongoose')

var adminSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    name: {type: String},
    email: {type: String}
}, {timestamps: true})

var Admin = mongoose.model("Admin",adminSchema);
module.exports = Admin