
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var db = require('./db');

// init db
db.init();

var index = require('./routes/index');
var household = require('./routes/household');
var breakdown = require('./routes/breakdown');
var settings = require('./routes/settings');
var appliance = require('./routes/appliance');
var welcome = require('./routes/welcome');
var signUp = require('./routes/sign-up');
var signIn = require('./routes/sign-in');


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

// Moment!
app.locals.moment = require('moment');

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var loadUser = function(req, res, next) {
  req.userId = 2;
  res.locals.userId = req.userId;
  next();
}

// Add routes here
app.all('*', loadUser);
app.get('/', index.view);
app.get('/settings', settings.view);

app.get('/create', household.view);
app.post('/create', household.create);

// Ugh should've done /household maybe
app.get('/breakdown/:household', breakdown.view);
app.get('/breakdown/:household/:member', breakdown.viewUser);

app.get('/household/options/:household', household.viewOptions);
app.post('/household/options', household.update);

app.get('/appliance/edit/:household/:applianceId', appliance.edit);
app.post('/appliance/toggle/:appliance', appliance.toggle);
app.post('/appliance/add/:household', appliance.add);
app.post('/appliance/edit/:householdId/:applianceId', appliance.update);
app.post('/appliance/delete/:householdId/:applianceId', appliance.delete);

app.get('/welcome', welcome.view);
app.get('/sign-up', signUp.view);
app.get('/sign-in', signIn.view)

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
