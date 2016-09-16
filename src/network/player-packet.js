'use strict';
var UserPacket = require('./user-packet');

class PlayerPacket extends UserPacket{
	constructor(name, onread){
		super(name, (name, socket, ...args) => {
			if(!socket.handshake.session.permission) return;
			onread(name, socket, ...args);
		});
	}
}

module.exports = PlayerPacket;
