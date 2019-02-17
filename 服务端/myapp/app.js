var createError = require('http-errors');
var express = require('express');
var bodyparse = require('body-parser')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var TOKEN = require('./public/javascripts/token')
var ejs = require('ejs')

var usersRouter = require('./routes/users');
var publicRouter = require('./routes/upload');
var articleRouter = require('./routes/article');

var cookie=require('cookie-parser'); 
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
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');


app.set('views', path.join(__dirname, 'views/'));
app.engine('ejs', ejs.renderFile);
app.set('view engine', 'ejs');

app.use(cookie());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// 设置私有路由集合  私有路由必须带有有效token
let privateRoute = ['/article/addArticle', '/article/delArticle', '/article/getMyArticle', '/article/updateArticle']


// 全局中间件，每次都会执行 那么意味着可以利用这点做一些请求拦截或者校验 例如：检查token
app.use(function(req, res, next) {
  if (privateRoute.includes(req.path)) {
    console.log('接收的TOKEN:' + req.cookies.TOKEN)
    TOKEN.checkToken(req.cookies.TOKEN, () => {
      console.log('私有路由，token有效')
      next()
    }, () => {
      console.log('token无效，请登陆')
      res.status(200);
      res.end(JSON.stringify({code: 101, data: null, msg: '请登陆'}))
    })
  } else {
    next()
  }
})

// 挂载路由
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
  // res.render('error'); // 视图在打包之后会找不到视图文件 暂未解决  折中处理  返回其错误信息  并不显示在页面
  res.end(JSON.stringify({error: res.locals.error, message: err.message}))
});

module.exports = app;
