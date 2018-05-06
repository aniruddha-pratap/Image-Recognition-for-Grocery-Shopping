var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var fs = require('fs');
//var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var  mysql = require('mysql');
var session = require('client-sessions');

var signin = require('./routes/signin');
var signup = require('./routes/signup');
var logout = require('./routes/logout');
var cart = require('./routes/cart');
var cartRemove = require('./routes/cartRemove');
var updateTotal = require('./routes/updateTotal');

var app = express();

// view engine setup
app.set('port', process.env.PORT || 3030);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({   
	cookieName: 'session',    
	secret: 'cmpe273_test_string',  
	duration: 30 * 60 * 1000,    //setting the time for active session
	activeDuration: 5 * 60 * 1000,  }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/signin', signin);
app.use('/signup', signup);
app.use('/logout', logout);
app.use('/cart', cart);
app.use('/updateTotal', updateTotal);
app.use('/cartRemove', cartRemove);

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

app.listen(app.get('port'), function(){
	 console.log('App listening port' + app.get('port'));
});

module.exports = app;
