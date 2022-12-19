const mongoose = require('mongoose');

var ContractSchema = new mongoose.Schema({
    title: {type: String, required: true},
    body: {type: String, required: true},
    percentageTaken: {type: Number, required: true}
}, {timestamp: true});

var Contract = mongoose.model("Contract",ContractSchema);
module.exports = Contract;