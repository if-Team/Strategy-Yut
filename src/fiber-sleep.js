var Fiber = require('fibers');
module.exports = (ms) => {
	var fiber = Fiber.current;
	setTimeout(() => {
		fiber.run();
	}, ms);
	Fiber.yield();
};
