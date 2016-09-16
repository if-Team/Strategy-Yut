'use strict';
var packet = require('./packet');

class UserPacket extends Packet{
	constructor(name, onread){
		super(name, (socket, ...args) => {
			if(socket.handshake.session.username === undefined) return;
			onread(socket.handshake.session.username, socket, ...args);
		});
	}
}

module.exports = UserPacket;
