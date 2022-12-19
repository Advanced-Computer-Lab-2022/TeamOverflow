const mongoose = require('mongoose')
var RequestsSchema = new mongoose.Schema({
    traineeId: {type: mongoose.Types.ObjectId, ref:"CorporateTrainee", required: true},
    courseId: {type: mongoose.Types.ObjectId, ref:"Course", required: true},
}, {timestamps: true})


var Requests = mongoose.model("Requests",RequestsSchema);
module.exports = Requests