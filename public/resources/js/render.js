var _canvas = $('#canvas');
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
var pieces = [];
var drawnPieces = [];
var players = {};
var teams = {};
var socket = io();
var doRender = true;

var allchat = $('#all-chatting');
var teamchat = $('#team-chatting');
var allcontent = $('#all-content');
var teamcontent = $('#team-content');
var selectView = $('#select-view');
var selectCanvas = $('#select-canvas');
var sCanvas = selectCanvas[0];
var sCtx = sCanvas.getContext('2d');
$('#select').css({visibility: 'hidden', display: 'block'});
sCanvas.width = selectCanvas.width();
sCanvas.height = selectCanvas.height();
$('#select').css({visibility: '', display: ''});
var sMin = sCanvas.width < sCanvas.height ? sCanvas.width : sCanvas.height;
sCtx.font = 'italic ' + sMin / 2 + 'px koverwatch';
sCtx.textAlign = 'center';
sCtx.textBaseline = 'middle';

setInterval(function(){
	Timer.update();
	if(Timer.left() > 0){
		sCtx.clearRect(0, 0, sCanvas.width, sCanvas.height);

		sCtx.fillStyle = "#f00";
		sCtx.beginPath();
		sCtx.moveTo(sCanvas.width / 2, sCanvas.height / 2);
		sCtx.arc(sCanvas.width / 2, sCanvas.height / 2, sMin / 2 - 5, -Math.PI / 2, (Timer.angle() - 90) * Math.PI / 180, true);
		sCtx.fill();
		sCtx.closePath();

		sCtx.fillStyle = "#fff";
		sCtx.beginPath();
		sCtx.moveTo(sCanvas.width / 2, sCanvas.height / 2);
		sCtx.arc(sCanvas.width / 2, sCanvas.height / 2, sMin / 2 - 15, 0, Math.PI * 2, true);
		sCtx.fill();
		sCtx.closePath();

		sCtx.fillStyle = '#f00';
		sCtx.fillText(Math.floor(Timer.left() / 1000), sCanvas.width / 2 - sMin / 20, sCanvas.height / 2);
	}else sCtx.clearRect(0, 0, sCanvas.width, sCanvas.height);
}, 100);

socket.on('status', function(data){
	game = data;
	game.forEach(function(v){
		players[v.name] = v;
		pieces = pieces.concat(v.pieces);
		if(teams[v.team] === undefined) teams[v.team] = [];
		teams[v.team].push(v.name);
	});

	pieces.forEach(function(v, k){
		players[v.player].pieces[v.index].key = k;
		drawnPieces[k] = {
			color: players[v.player].color,
			player: v.player,
			index: v.index,
			finished: v.finished,
			x: board[v.pos].x,
			y: board[v.pos].y
		};
	});
});

socket.on('yut result', function(data){
	var html = '<div class="row">';
	data.players.forEach(function(v){
		if(v){
			html += '<img src="/resources/img/yut-stick-front.svg" style="height: 100px">';
		}else html += '<img src="/resources/img/yut-stick-back.svg" style="height: 100px">';
	});

});

socket.on('select piece', function(data){
	addSelectView(data);
	Timer.start(20000, function(){
		removeSelectView();
	});
});

socket.on('throw yut', function(){
	addThrowView();
});

socket.on('chat team', function(data){
	addToTeamChat(data);
	teamchat.animate({ scrollTop: teamchat[0].scrollHeight}, 100);
});

socket.on('chat all', function(data){
	addToAllChat(data);
	allchat.animate({ scrollTop: allchat[0].scrollHeight}, 100);
});

socket.on('finished piece', function(data){
	var piece = players[data.player].pieces[data.id];
	piece.finished = true;
	drawnPieces[piece.key].finished = true;
});

socket.on('piece move', function(data){
	var tween = new TWEEN.Tween(pieces[players[data.player].pieces[data.id].key])
	.to({ x: board[data.pos].x, y: board[data.pos].y }, 500)
	.start();
});

socket.on('game win', function(data){

});

socket.on('log all', function(data){
	data.forEach(function(v){
		addToAllChat(v);
	});
});

socket.on('log team', function(data){
	data.forEach(function(v){
		addToTeamChat(v);
	});
});

socket.emit('status');
socket.emit('log all');
if(permission) socket.emit('log team');

function addThrowView(){
	selectView[0].innerHTML = '<div class="row">' +
		'<button type="button" onclick="throwYut(true)" class="btn"><img src="/resources/img/yut-stick-front.svg" style="height: 100px;"></button>' +
		'<button type="button" onclick="throwYut(false)" class="btn"><img src="/resources/img/yut-stick-back.svg" style="height: 100px;"></button>' +
	'</div>';
}

function addSelectView(data){
	doRender = false;
	var myColor = players[myName].color;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBoard();
	players[myName].pieces.forEach(function(v){
		var img = new Image();
		var obj = drawnPieces[v.key];
		img.onload = function(){
			ctx.drawImage(img, (minX + obj.x - radius) * m, (minY + obj.y - radius) * m, 2 * radius * m, 2 * radius * m);
		};
		img.src = '/piece/' + myColor + '/for/' + v.id;
	});

	var htmlString = '<div class="row">';
	data.data.forEach(function(v){
		htmlString += '<button type="button" onclick="selectPiece(' + v.id + ')" class="btn"><img src="/piece/' + myColor + '/for/' + v.id + '" style="height: 100px;"></button>'
	});
	if(data.groupnizable) htmlString += '</div><div class="row">' +
		'<button type="button" onclick="selectPiece(2)" class="btn">' +
			'<img src="/piece/' + myColor + '/for/0" style="height: 100px;">' +
			'<img src="/piece/' + myColor + '/for/1" style="height: 100px;"></button>'

	selectView[0].innerHTML = htmlString + '</div>';
}

function selectPiece(num){
	Timer.stop();
	removeSelectView();
	socket.emit('select piece', num);
}

function removeSelectView(){
	doRender = true;
	selectView[0].innerHTML = '';
}

function throwYut(isFront){
	socket.emit('throw yut', isFront);
	removeSelectView();
}

var addChat = function(board){
	return function(text){
		if(text === 'NEW GAME!'){
			var newGame = document.createElement('li');
			newGame.innerHTML = '<img src="/resources/img/new-game.png" style="width: 100%">';
			var ganbaruzo = document.createElement('li');
			ganbaruzo.innerHTML = '<img src="/resources/img/ganbaruzo.jpg" style="width: 100%">';

			board.append(newGame).append(ganbaruzo);
			return;
		}

		var li = $(document.createElement('li'));
		li.text(text);
		board.append(li);
	};
};

var addToAllChat = addChat(allchat);
var addToTeamChat = addChat(teamchat);

function sendChatAll(){
	socket.emit('chat all', allcontent.val());
	allcontent.val('');
}

function sendChatTeam(){
	socket.emit('chat team', teamcontent.val());
	teamcontent.val('');
}

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

function render(time){
	if(!doRender) return;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBoard();
	renderPieces();
	TWEEN.update(time);
	requestAnimationFrame(render);
}

function renderPieces(){
	var tile = {};
	drawnPieces.forEach(function(v){
		if(!tile[v.x]) tile[v.x] = {};
		if(!tile[v.x][v.y]) tile[v.x][v.y] = [];
		tile[v.x][v.y].push(v.index + v.player);
	});

	drawnPieces.forEach(function(v){
		if(v.finished) return;
		ctx.fillStyle = v.color;
		ctx.beginPath();
		if(tile[v.x][v.y].length <= 1){
			ctx.arc(minX + v.x * m, minY + v.y * m, radius * m, 0, Math.PI * 2);
		}else{
			var amount = 360 / tile[v.x][v.y].length;
			var start = (tile[v.x][v.y].indexOf(v.index + v.player) * amount);
			ctx.moveTo(minX + v.x * m, minY + v.y * m);
			ctx.arc(minX + v.x * m, minY + v.y * m, radius * m, start * Math.PI / 180, (start + amount) * Math.PI / 180);
		}
		ctx.fill();
		ctx.closePath();
	});
}

canvas.width = _canvas.width();
canvas.height = _canvas.height();

readBoard();

render();
