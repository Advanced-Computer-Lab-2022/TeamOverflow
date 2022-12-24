const mongoose = require('mongoose');

var FollowupSchema = new mongoose.Schema({
    reportId: {type: mongoose.Types.ObjectId, ref:"Report", required: true},
    content: {type: String}
}, {timestamps: true})

var Followup = mongoose.model("Followup",FollowupSchema);
module.exports = Followup