var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cors = require("cors")
const mongoose = require('mongoose')
require('dotenv').config()

var adminsRouter = require('./routes/admin');
var traineesRouter = require('./routes/trainee');
var corporateRouter = require('./routes/corporate-trainee');
var coursesRouter = require('./routes/courses');
var instructorsRouter = require('./routes/instructors');
var authenticationRouter = require('./routes/authentication');
var videoRouter = require('./routes/video');
var ratingRouter = require('./routes/rating');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/trainee', traineesRouter);
app.use('/corpTrainee', corporateRouter);
app.use('/admin', adminsRouter);
app.use('/course', coursesRouter);
app.use('/instructor', instructorsRouter);
app.use('/auth', authenticationRouter);
app.use('/video', videoRouter);
app.use('/rate', ratingRouter);

app.get('/', function(req,res) {
  res.render("index", {
    title: "Learning System"
  })
})
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

mongoose.connect(process.env.DB_URL).then(() => {
  var port = process.env.PORT || 8000
  app.listen(port)
  console.log(`Listening to requests on http://localhost:${port}`)
})

module.exports = app;