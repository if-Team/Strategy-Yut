var fs = require('fs');
var path = require('path');
var router = require('express').Router();
var _ = require('../src/error');

var Canvas;
var canvas;
var ctx;
try{
	Canvas = require('canvas');
	if(Canvas !== undefined){
		canvas = new Canvas(1024, 1024);
		ctx = canvas.getContext('2d');
		var museca = new Canvas.Font('museca', path.join(__dirname, '..', 'resources', 'fonts', 'museca.ttf'));
		ctx.addFont(museca);
		ctx.lineWidth = 100;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.font = 'normal normal 512px sans-serif'; //not museca because there is bug in node-canvas
	}
}catch(e){}

router.get('/', (req, res, next) => {
	if(!req.session.username) return res.redirect('/login');
	res.render('index');
});

router.get('/login', (req, res, next) => {
	if(req.session.username) return next(_(403, '이미 로그인 되어있습니다!'));
	res.render('login');
});

router.post('/login', (req, res, next) => {
	var name = req.body.name;
	var pw = req.body.pw;

	if(name === undefined) return next(_(400, 'ID를 입력하여 주세요!'));
	if(!/^[a-zA-Z0-9]{5,20}$/.test(name)) return next(_(400, 'ID에 부적절한 문자열이 들어있거나 너무 짧거나 깁니다!'));
	if(config.registered[name] !== undefined && config.registered[name] !== pw) return next(_(403, '이 ID는 게임 참가자의 ID이지만, 비밀번호가 다릅니다!'));

	req.session.username = name;
	req.session.permission = config.registered[name] !== undefined;
	req.session.save(() => {
		res.redirect('/');
	});
});

router.get('/logout', (req, res, next) => {
	if(!req.session.username) return next(_(403, '로그인을 먼저 하여주세요!'));
	req.session.username = undefined;
	req.session.permission = undefined;
	req.session.save(() => {
		res.redirect('/');
	});
});

router.get('/piece/:color/for/:id', (req, res, next) => {
	var id = req.params.id.toString().charAt(0);
	var color = req.params.color;
	if(!/^#[0-9A-F]{6,6}$/.test(color)) color = '#00C0A0';

	if(Canvas !== undefined){
		try{
			ctx.strokeStyle = color;
			ctx.fillStyle = color;
			ctx.clearRect(0, 0, 1024, 1024);
			ctx.beginPath();
			ctx.arc(512, 512, 512, 0, Math.PI * 2);
			ctx.stroke();

			ctx.fillText(id, 512, 512);
			canvas.toBuffer((err, buf) => {
				if(err){
					res.status(400).json({
						error: 1
					});
					return;
				}
				res.status(200).set('Content-Type', 'image/png').send(buf)
			});
		}catch(e){
			res.status(400).json({
				error: 1
			});
		}
	}else{
		fs.createReadStream(path.join(__dirname, '..', 'resources', 'img', 'piece-base.svg')).pipe(res);
	}
})

module.exports = router;
