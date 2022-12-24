const mongoose = require('mongoose');
const paginate = require("mongoose-paginate");

var RefundSchema = new mongoose.Schema({
   registrationId: {type: mongoose.Types.ObjectId, ref:"StudentCourses" , required: true},
   traineeId: {type: mongoose.Types.ObjectId, ref:"Trainee" , required: true},
   instructorId : {type: mongoose.Types.ObjectId, ref:"Instructor" , required: true}
}, {timestamp: true});

RefundSchema.plugin(paginate)
var Refund = mongoose.model("Refund",RefundSchema);
module.exports = Refund;