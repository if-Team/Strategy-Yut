var PlayerPacket = require('./user-packet');

class SelectPiecePacket extends PlayerPacket{
	constructor(){
		super('select piece', (username, socket, data) => {
			if(game.players[username] === undefined) return;
			if(typeof data !== number) return;
			game.handleSelect(username, data);
		});
	}
}

module.exports = SelectPiecePacket;
