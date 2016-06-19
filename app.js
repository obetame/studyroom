var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var credentials = require('./credentials');//cookie密钥
var mongoose = require('mongoose');//连接mongodb


var index = require('./routes/index');
var select = require('./routes/select');
var login = require('./routes/login');
var register = require('./routes/register');
var usercenter = require('./routes/usercenter');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(credentials.cookieSecret));//引用cookie密钥加密
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('express-session')({
  secret:credentials.cookieSecret,
  name:'studyroom',
  cookie:{maxAge:3600000*24*7},//会话超时时间24*7个小时(60000为一分钟)
  resave:false,
  saveUninitialized:true,
}));//链入中间件express-session管理会话

app.use('/', index);
app.use('/select', select);
app.use('/login', login);
app.use('/register', register);
app.use('/usercenter', usercenter);

//打开mongodb连接,区分生成模式还是开发模式下的连接
var opts = {
  server:{
    //防止长期运行的程序出现数据库连接错误
    socketOptions:{keepAlive:1}
  }
};
mongoose.connect(credentials.mongo.studyroom.connectionString,opts);


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
