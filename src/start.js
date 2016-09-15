var app = require('./app');
var debug = require('debug')('mealworm:server');
var fs = require('fs');
var http = require('http');

var MongoClient = require('mongodb').MongoClient;

global.config = require('../server');
global.socketEvents = require('./network/events');

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
	global.game = new require('./game')();
	var server = http.createServer(app);

	server.listen(port);
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
		debug('Listening on ' + bind);
	});

	var io = require('socket.io')(httpServer);
	io.use(sharedsession(global.session));

	io.on('connection', (socket) => {
		socketEvents.forEach((v) => {
			v(socket);
		});
	});
});
