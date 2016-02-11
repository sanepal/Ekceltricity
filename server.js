
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

// Example route
// var user = require('./routes/user');
var index = require('./routes/index');
var household = require('./routes/household');
var breakdown = require('./routes/breakdown')
var myOverview = require('./routes/my-overview');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('Intro HCI secret key'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var loadUser = function(req, res, next) {
  req.userId = 2;
  next();
}

// Add routes here
app.all('*', loadUser);
app.get('/', index.view);
app.get('/breakdown/:household', breakdown.view);
app.get('/create', household.view);
app.post('/create', household.create);
app.get('/breakdown/:household/:member', myOverview.view);
// Example route
// app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
