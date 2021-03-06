var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var classRouter = require('./routes/class');
var professionRouter = require('./routes/profession');
var assessmentCategory = require('./routes/assessmentCategory');
var lessonRouter = require('./routes/lesson');
var assessmentRouter = require('./routes/assessment');
var taskRouter = require('./routes/task');
var accessToLessonRouter = require('./routes/accessToLesson');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/user', usersRouter);
app.use('/api/class', classRouter);
app.use('/api/profession', professionRouter);
app.use('/api/assessmentCategory', assessmentCategory);
app.use('/api/lesson', lessonRouter);
app.use('/api/assessment', assessmentRouter);
app.use('/api/task', taskRouter);
app.use('/api/accessToLesson', accessToLessonRouter);
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

module.exports = app;
