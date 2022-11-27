const mongoose = require('mongoose')
var corporateTraineeCoursesSchema = new mongoose.Schema({
    corporateTraineeId: {type: mongoose.Types.ObjectId, ref:"CorporateTrainee", required: true},
    courseId: {type: mongoose.Types.ObjectId, ref:"Course", required: true}
}, {timestamps: true})


var CorporateTraineeCourses = mongoose.model("CorporateTraineeCourses",corporateTraineeCoursesSchema);
module.exports = CorporateTraineeCourses