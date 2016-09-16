'use strict';
class Packet{
	constructor(name, onread){
		this.name = name;
		this.onread = onread;
	}

	listenToSocket(socket){
		socket.on(this.name, (...args) => {
			this.onread(socket, ...args);
		});
	}
}

module.exports = Packet;
