const mongoose = require('mongoose');
const paginate = require("mongoose-paginate");

var RefundSchema = new mongoose.Schema({
   amount : {type: Number},
   walletId: {type: mongoose.Types.ObjectId, ref:"Wallet" , required: true}
}, {timestamp: true});

RefundSchema.plugin(paginate)
var Refund = mongoose.model("Refund",RefundSchema);
module.exports = Refund;