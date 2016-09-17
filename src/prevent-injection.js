var async = require('async');

module.exports = (req, resp, next) => {
	//Anti SQL Injection
	['body', 'query', 'params', 'cookies'].forEach((k) => {
		Object.keys(req[k]).forEach((k2) => {
			var v = req[k][k2];
			if(typeof v === 'boolean') v = (v ? 1 : 0);
			req[k][k2] = (typeof v === 'string' || typeof v === 'number') ? v : '';
		});
	});
	next();
};
