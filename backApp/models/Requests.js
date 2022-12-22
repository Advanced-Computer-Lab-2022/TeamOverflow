const mongoose = require('mongoose');
const paginate = require("mongoose-paginate");

var RequestsSchema = new mongoose.Schema({
    traineeId: {type: mongoose.Types.ObjectId, ref:"CorporateTrainee", required: true},
    courseId: {type: mongoose.Types.ObjectId, ref:"Course", required: true}
}, {timestamps: true})

RequestsSchema.plugin(paginate)
var Requests = mongoose.model("Requests",RequestsSchema);
module.exports = Requests