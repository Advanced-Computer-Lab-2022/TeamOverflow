const mongoose = require('mongoose');

var WalletSchema = new mongoose.Schema({
   balance : {type: Number, default: 0},
}, {timestamp: true});

var Wallet = mongoose.model("Wallet",WalletSchema);
module.exports = Wallet;