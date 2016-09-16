global.config = require('../config');

var app = require('./app');
var fs = require('fs');
var http = require('http');
var sharedsession = require('express-socket.io-session')

var MongoClient = require('mongodb').MongoClient;

global.socketEvents = require('./network/');

var port = ((val) => {
	var port = parseInt(val, 10);

	if(isNaN(port)) return val;
	if(port >= 0) return port;
	return false;
})(process.env.PORT || '3000');

app.set('port', port);

var url = "mongodb://" + global.config['db-address'] + ":" + global.config['db-port'] + "/" + global.config['db-name'];
MongoClient.connect(url, (err, client) => {
	global.mongo = client;
	var Game = require('./game');
	global.game = new Game();
	var saveOnDeath = () => {
		require('fs').writeFileSync('./gamesnapshot.dat', JSON.stringify(game.save()));
		console.log('Saved before death');
	};

	process.on('exit', () => {
		saveOnDeath();
		process.exit(0);
	});

	process.on('SIGINT', () => {
		process.exit(0);
	});

	process.on('uncaughtException', (e) => {
		console.log(e);
		saveOnDeath();
		server.close();
		debugger;
	});

	var server = http.createServer(app);

	server.on('error', (error) => {
		if(error.syscall !== 'listen') throw error;

		var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

		switch(error.code){
			case 'EACCES':
				console.error(bind + ' requires elevated privileges');
				process.exit(1);
				break;
			case 'EADDRINUSE':
				console.error(bind + ' is already in use');
				process.exit(1);
				break;
			default:
				throw error;
		}
	});

	server.on('listening', () => {
		var addr = server.address();
		var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
		console.log('Listening on ' + bind);
	});

	server.listen(port);

	var io = require('socket.io')(server);
	io.use(sharedsession(global.session));

	io.on('connection', (socket) => {
		socketEvents.forEach((v) => {
			v(socket);
		});
	});
});
