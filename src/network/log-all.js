var UserPacket = require('./user-packet');

class LogAllPacket extends UserPacket{
	constructor(){
		super('log all', (username, socket) => {
			socket.emit('log all', game.gameLog);
		});
	}
}

module.exports = LogAllPacket;
