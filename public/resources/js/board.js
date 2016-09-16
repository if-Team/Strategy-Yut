var board = [];

var Tile = function(x, y, connected){
	this.x = x;
	this.y = y;
	this.connected = connected;
};

board[0] = new Tile(87, 96, [1]);
board[1] = new Tile(87, 79, [2]);
board[2] = new Tile(87, 63, [3]);
board[3] = new Tile(87, 46, [4]);
board[4] = new Tile(87, 29, [5]);
board[5] = new Tile(87, 13, [6, 9]);
board[6] = new Tile(71, 29, [7]);
board[7] = new Tile(54, 46, [8, 14]);
board[8] = new Tile(37, 63, [18]);
board[9] = new Tile(71, 13, [10]);
board[10] = new Tile(54, 13, [11]);
board[11] = new Tile(37, 13, [12]);
board[12] = new Tile(21, 13, [13, 15]);
board[13] = new Tile(37, 29, [7]);
board[14] = new Tile(71, 63, [1]);
board[15] = new Tile(21, 29, [16]);
board[16] = new Tile(21, 46, [17]);
board[17] = new Tile(21, 63, [18]);
board[18] = new Tile(21, 79, [19]);
board[19] = new Tile(37, 79, [20]);
board[20] = new Tile(54, 79, [21]);
board[21] = new Tile(71, 79, [1]);
