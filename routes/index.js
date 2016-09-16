var router = require('express').Router();
var _ = require('../src/error');

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

	if(name === undefined || pw === undefined) return next(_(400, 'ID와 비밀번호를 입력하여 주세요!'));
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

module.exports = router;
