const mongoose = require('mongoose');

var CertificatesSchema = new mongoose.Schema({
    traineeId : {type: mongoose.Types.ObjectId, required: true},
    courseId: {type: mongoose.Types.ObjectId, ref:"Course", required: true},
    timestamp: {type: Number, required: true},
}, {timestamp: true});

var Certificate = mongoose.model("Certificate",CertificatesSchema);
module.exports = Certificate;

