const mongoose = require('mongoose');

var TermsSchema = new mongoose.Schema({
    body: {type: String, required: true},
}, {timestamp: true});

var Terms = mongoose.model("Terms",TermsSchema);
module.exports = Terms;