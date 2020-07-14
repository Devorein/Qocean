const ErrorResponse = require('../utils/errorResponse');
const colors = require('colors');

function errorHandler(err, req, res) {
	colors.red(console.log(err.name));

	let error = { ...err };
	error.message = err.message;

	// Mongoose bad objectid
	if (err.name === 'CastError') {
		const message = `Resource not found`;
		error = new ErrorResponse(message, 404);
	}

	// Mongoose duplicate key
	if (err.code === 11000) {
		const [ [ key, value ] ] = Object.entries(err.keyValue);
		const message = `A user with ${key} ${value} already exists`;
		error = new ErrorResponse(message, 400);
	}

	// Mongoose validation error
	if (err.name === 'ValidationError') {
		const message = Object.values(err.errors).map((error) => error.message);
		error = new ErrorResponse(message, 400);
	}

	res.status(error.statusCode || 500).json({ success: false, error: error.message || 'Server Error' });
}

module.exports = errorHandler;
