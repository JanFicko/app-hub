const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const jwt = require('./helpers/jwt');
const mongoose = require('mongoose');
const config = require('./config');

require('./models/user');
require('./models/project');

var app = express();

/**
 * Connect to MongoDB database server.
 */
// sudo mongo app-hub --eval "db.dropDatabase()"
mongoose.connect(
    'mongodb://' + config.MONGODB_IP + ':'+ config.MONGODB_PORT +'/'+ config.MONGODB_DATABASE_NAME,
    {
      useCreateIndex: true,
      useNewUrlParser: true
    });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(jwt());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Headers", '*');
    res.header('Access-Control-Allow-Methods', '*');
    next();
});
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
