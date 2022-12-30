const mongoose = require('mongoose')

var corporateSchema = new mongoose.Schema({
    corporates: [{type: String}]
}, {timestamps: true})

var Corporate = mongoose.model("Corporate",corporateSchema);
module.exports = Corporate