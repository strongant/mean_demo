var express = require('express');
var path = require('path');
var fs = require('fs');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var tokenManage = require('./models/Token');
var settings = require('./config/settings');
var routes = require('./routes/index');
var todos = require('./routes/todos');



//引入mongoose的支持
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/todoApp', function(err) {
  if (err) {
    console.error('connection error', err);
  } else {
    console.log('connection successful');
  }
});

var app = express();
//调整express默认允许的大小
app.use(bodyParser.json({
  limit: '1024mb'
}));
app.use(bodyParser.urlencoded({
  limit: '1024mb',
  extended: true
}));
var logger = require('morgan');
var configFile = path.join(__dirname, 'logs') +
  "/logfile.log";

app.use(logger('dev'));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine',
  'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser("this is my cookie"));
app.use(express.static(
  path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/todos', todos);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
