var UserPacket = require('./user-packet');

var userData = {};

class ChatAllPacket extends UserPacket{
	constructor(){
		super('chat all', (username, socket, data) => {
			if(typeof data !== 'string' && typeof data !== 'number') return false;
			if(data.toString().length > 500) return false;
			if(data.toString().length === 0) return false;
			if(userData[username] && userData[username] > Date.now()) return false;
			userData[username] = Date.now() + 1000;
			game.chatToAll(username, data);
		});
	}
}

module.exports = ChatAllPacket;
