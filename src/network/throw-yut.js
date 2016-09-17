var PlayerPacket = require('./user-packet');

class ThrowYutPacket extends PlayerPacket{
	constructor(){
		super('throw yut', (username, socket, data) => {
			if(game.players[username] === undefined) return;
			if(typeof data !== boolean) return;
			game.handleThrow(username, data);
		});
	}
}

module.exports = ThrowYutPacket;
