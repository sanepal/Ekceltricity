
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var db = require('./db');

// init db
db.init();

// Example route
// var user = require('./routes/user');
var index = require('./routes/index');
var household = require('./routes/household');
var breakdown = require('./routes/breakdown');
var myOverview = require('./routes/my-overview');
var settings = require('./routes/settings');
var tracking = require('./routes/tracking');
var householdOptions = require('./routes/household-options');
var editAppliance = require('./routes/edit-appliance');
var deleteAppliance = require('./routes/delete-appliance');

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
app.get('/breakdown/:household', breakdown.view);
app.get('/create', household.view);
app.post('/create', household.create);
app.get('/breakdown/:household/:member', myOverview.view);
app.get('/tracking/:appliance', tracking.toggle);
app.post('/my-overview/:household', myOverview.addAppliance);
app.get('/settings', settings.view);
app.get('/household-options/:household', householdOptions.view);
app.post('/household-options', householdOptions.create);
app.get('/edit-appliance/:household/:applianceId', editAppliance.view);
app.post('/edit-appliance/:householdId/:applianceId', editAppliance.update);
app.get('/delete-appliance/:householdId/:applianceId', deleteAppliance.view);
// Example route
// app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
