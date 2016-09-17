var board = [];

var rate = 100 / 7;

var Tile = function(x, y, connected){
	this.x = x * rate + 4;
	this.y = y * rate - 4;
	this.connected = connected;
};

board[0] = new Tile(6, 7, [1]);
board[1] = new Tile(6, 6, [2]);
board[2] = new Tile(6, 5, [3]);
board[3] = new Tile(6, 4, [4]);
board[4] = new Tile(6, 3, [5]);
board[5] = new Tile(6, 2, [6]);
board[6] = new Tile(6, 1, [7, 12]);
board[7] = new Tile(5, 2, [8]);
board[8] = new Tile(4, 3, [9]);
board[9] = new Tile(3.5, 3.5, [10, 19]);
board[10] = new Tile(3, 4, [11]);
board[11] = new Tile(2, 5, [25]);
board[12] = new Tile(5, 1, [13]);
board[13] = new Tile(4, 1, [14]);
board[14] = new Tile(3, 1, [15]);
board[15] = new Tile(2, 1, [16]);
board[16] = new Tile(1, 1, [17, 21]);
board[17] = new Tile(2, 2, [18]);
board[18] = new Tile(3, 3, [9]);
board[19] = new Tile(4, 4, [20]);
board[20] = new Tile(5, 5, [1]);
board[21] = new Tile(1, 2, [22]);
board[22] = new Tile(1, 3, [23]);
board[23] = new Tile(1, 4, [24]);
board[24] = new Tile(1, 5, [25]);
board[25] = new Tile(1, 6, [26]);
board[26] = new Tile(2, 6, [27]);
board[27] = new Tile(3, 6, [28]);
board[28] = new Tile(4, 6, [29]);
board[29] = new Tile(5, 6, [1]);
