var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var userRouter = require('./routes/user');
var profileRouter = require('./routes/profiles');
var articleRouter = require('./routes/articles')

require('dotenv').config();

// db connection m
mongoose.connect('mongodb://localhost/conduitDB',
{useNewUrlParser: true, useUnifiedTopology: true},
(err) => console.log(err ? err : "Database is connected!"));

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/user', userRouter);
app.use('/api/profiles', profileRouter);
app.use('/api/articles', articleRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500).json({err});
});

module.exports = app;
