const mongoose = require('mongoose');
const paginate = require("mongoose-paginate")

var InvoiceSchema = new mongoose.Schema({
    instructorId: {type: mongoose.Types.ObjectId, ref:"Instructor", required: true},
    traineeId : {type: mongoose.Types.ObjectId, required: true},
    courseId: {type: mongoose.Types.ObjectId, ref:"Course", required: true},
    balance: {type: Number, required: true}
}, {timestamp: true});

InvoiceSchema.plugin(paginate)
var Invoice = mongoose.model("Invoice",InvoiceSchema);
module.exports = Invoice;

