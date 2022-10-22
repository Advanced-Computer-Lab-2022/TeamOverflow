const mongoose = require('mongoose')

var courseSchema = new mongoose.Schema({
    courseId: {type: Number},
    title : {type: String, required: true},
    subtitle: {type: String, required: true},
    subject: {type: String, required: true},
    summary: {type: String, required: true},
    price: {type: Number, required: true},
    instructorId: {type: String, required: true}
})

courseSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.updated_at = currentDate;

    if (!this.created_at)
        this.created_at = currentDate;

    var sno = 1;
    var course = this;
    Course.find({}, function(err, courses) {
    if (err) throw err;
        sno = courses.length + 1;
        course.courseId = sno;
        next();
    });
});

var Course = mongoose.model("Course",courseSchema);
module.exports = Course