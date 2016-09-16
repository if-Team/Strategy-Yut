'use strict';
class Packet{
	constructor(name, onread){
		this.name = name;
		this.onread = onread;
	}

	listenToSocket(socket){
		socket.on(this.name, () => {
			this.onread(socket);
		});
	}
}

module.exports = Packet;
