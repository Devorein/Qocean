const rateLimiter = require('express-rate-limit');

module.exports = function() {
	let limiter = null;
	if (process.env.NODE_ENV === 'development') {
		limiter = rateLimiter({
			windowMs: 10 * 60 * 1000,
			max: 1000
		});
	} else {
		limiter = rateLimiter({
			windowMs: 10 * 60 * 1000,
			max: 500
		});
	}
	return limiter;
};
