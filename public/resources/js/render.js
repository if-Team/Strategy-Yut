var _canvas = $('canvas');
var canvas = _canvas[0];
var ctx = canvas.getContext('2d');
var boardThings = [];
var radius = 4;
var size = Math.round((_canvas.height() < _canvas.width()) ? _canvas.height() : _canvas.width());
var minX = Math.round((_canvas.width() - size) / 2);
var maxX = minX + size;
var minY = Math.round((_canvas.height() - size) / 2);
var maxY = minY + size;
var m = size / 100;
var game = undefined;
var socket = io();

socket.emit('status');
socket.on('status', (data) => {
	game = data;
});

function readBoard(){
	var visited = [];
	var iterate = function(i){
		var t = board[i];
		visited.push(i);
		boardThings.push(['c', t.x, t.y]);
		t.connected.forEach(function(v){
			boardThings.push(['l', t.x, t.y, board[v].x, board[v].y]);
			if(visited.indexOf(v) === -1) iterate(v);
		});
	};
	iterate(0);
}

function drawBoard(){
	ctx.lineWidth = 5;
	ctx.strokeStyle = "#fff";
	boardThings.forEach(function(v){
		if(v[0] === 'c'){
			ctx.beginPath();
			ctx.arc(minX + v[1] * m, minY + v[2] * m, radius * m, 0, Math.PI * 2);
			ctx.stroke();
			ctx.closePath();
		}else{
			ctx.beginPath();
			ctx.moveTo(minX + v[1] * m, minY + v[2] * m);
			ctx.lineTo(minX + v[3] * m, minY + v[4] * m);
			ctx.stroke();
			ctx.closePath();
		}
	});
}

function render(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBoard();
}

function pieces(){

}

canvas.width = _canvas.width();
canvas.height = _canvas.height();
readBoard();
render();
