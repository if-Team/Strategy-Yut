var PlayerPacket = require('./user-packet');

class LogTeamPacket extends PlayerPacket{
	constructor(){
		super('log team', (username, socket) => {
			if(game.players[username] === undefined) return;
			socket.emit('log team', game.teamLog[game.players[username].teamIndex]);
		});
	}
}

module.exports = LogTeamPacket;
