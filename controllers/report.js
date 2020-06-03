const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

exports.createReport = asyncHandler(async function(req, res, next) {
	return next(new ErrorResponse(`Password is incorrect`, 401));
});
