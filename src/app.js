var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var preventInjection = require('./prevent-injection');

var routes = require('../routes/index');

global.session = session({
	secret: global.config['session-secret'],
	saveUninitialized: false,
	resave: false,
	store: new MongoStore({
		url: 'mongodb://' + global.config['db-address'] + ':' + global.config['db-port'] + '/' + global.config['collection-session'],
		ttl: 3600 * 24 * 7,
		touchAfter: 3 * 3600
	})
});

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(global.session);
app.use(preventInjection);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: err
	});
});


module.exports = app;
