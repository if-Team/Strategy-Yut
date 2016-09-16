var UserPacket = require('./user-packet');

class StatusPacket extends UserPacket{
	constructor(){
		super('status', (username, socket) => {
			socket.emit('status', Object.keys(game.players).map((k) => {
				var p = game.players[k];
				return {
					name: k,
					color: p.color,
					pieces: p.pieces.map((v) => {
						return {
							pos: v.pos,
							finished: v.finished,
							index: v.pieceIndex
						};
					}),
					team: p.teamIndex
				};
			}));
		});
	}
}

module.exports = StatusPacket;
