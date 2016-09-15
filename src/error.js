module.exports = (status, message) => {
	var e = new Error(message);
	e.status = status;
	return e;
};
