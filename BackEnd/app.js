var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');

require('./models/user');
require('./models/project');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/projects', require('./routes/projects'));
app.use('/api/users', require('./routes/users'));
app.use(express.static(__dirname + '/public'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404, "Not Found"));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err.message || 'Internal Server Error');
});

module.exports = app;
