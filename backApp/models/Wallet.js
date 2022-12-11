const mongoose = require('mongoose');

var WalletSchema = new mongoose.Schema({
    id: {type: String, required: true},
   debit: {type: Number},
    credit: {type:Number},
}, {timestamp: true});

var Wallet = mongoose.model("Wallet",WalletSchema);
module.exports = Wallet;