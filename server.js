var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var configDB = require('./config/database.js');

//CONFIG
mongoose.connect(configDB.url);

require('./config/passport')(passport);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());

app.use('views', __dirname+'/views');
app.set('view engine', 'ejs');

app.use(session({secret:'adaptivewebassignment', ßcookie: { maxAge: 3600000 } }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//ROUTES
require('./app/routes.js')(app, passport);

//FINISH
app.listen(port);
console.log('Server started and listening on', port);
