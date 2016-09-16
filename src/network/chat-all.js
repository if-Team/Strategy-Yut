var Packet = require('./packet');

class ChatAll extends Packet{
	constructor(){
		super('chat all', (socket) => {

		});
	}
}
