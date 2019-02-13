var createError = require('http-errors');
var express = require('express');
var bodyparse = require('body-parser')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var usersRouter = require('./routes/users');
var publicRouter = require('./routes/upload');
var articleRouter = require('./routes/article');

var app = express();

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin)
  res.header("Access-Control-Allow-Headers", "Content-Type")
  res.header("Content-Type", "application/json; charset=utf-8")
  res.header('Access-Control-Allow-Credentials', 'true')
  if (req.method === 'OPTIONS') {
    res.send(200)
  } else {
    next()
  }
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 根路径每次都会执行 那么意味着可以利用这点做一些请求拦截或者校验 例如：检查token
app.use('/', function(req, res, next) {
  // console.log('看看请求是不是每次都执行了')
  next()
})

app.use('/users', usersRouter);
app.use('/public', publicRouter);
app.use('/article', articleRouter);

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
