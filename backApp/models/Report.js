const mongoose = require('mongoose');
const paginate = require("mongoose-paginate");

var ReportSchema = new mongoose.Schema({
    userId: {type: mongoose.Types.ObjectId, required: true},
    userRef: {type: String, required: true},
    type: {type: String, enum: ["Financial", "Technical", "Other"], required: true},
    details: {type: String, required: true},
    status: {type: String, enum: ["Unseen", "Resolved", "Pending"], default: "Unseen"},
    courseId: {type: mongoose.Types.ObjectId, ref: "Course"}
}, {timestamps: true})

ReportSchema.plugin(paginate)
var Report = mongoose.model("Report",ReportSchema);
module.exports = Report