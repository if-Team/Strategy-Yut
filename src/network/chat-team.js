var PlayerPacket = require('./user-packet');

class ChatTeamPacket extends PlayerPacket{
	constructor(){
		super('chat team', (username, socket, data) => {
			if(typeof data !== 'string' && typeof data !== 'number') return false;
			if(data.toString().length > 500) return false;
			if(data.toString().length === 0) return false;
			game.chatToTeam(username, data);
		});
	}
}

module.exports = ChatTeamPacket;
