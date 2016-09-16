var UserPacket = require('./user-packet');

class ChatAllPacket extends UserPacket{
	constructor(){
		super('chat all', (username, socket, data) => {
			if(typeof data !== 'string' || typeof data !== 'number') return false;
			game.chatToAll(username, data);
		});
	}
}

module.exports = ChatAllPacket;
