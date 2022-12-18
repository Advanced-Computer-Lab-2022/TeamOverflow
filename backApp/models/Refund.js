const mongoose = require('mongoose');

var RefundSchema = new mongoose.Schema({
   amount : {type: Number},
   walletId: {type: mongoose.Types.ObjectId, ref:"Wallet" , required: true}
}, {timestamp: true});

var Refund = mongoose.model("Refund",RefundSchema);
module.exports = Refund;