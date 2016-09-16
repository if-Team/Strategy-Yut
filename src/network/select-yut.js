var PlayerPacket = require('./user-packet');

class SelectYutPacket extends PlayerPacket{
	constructor(){
		super('select yut', (username, socket, data) => {
			if(game.players[username] === undefined) return;
			if(typeof data !== boolean) return;
			game.handleThrow(username, data);
		});
	}
}

module.exports = SelectYutPacket;
