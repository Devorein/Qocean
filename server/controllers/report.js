const asyncHandler = require('../middleware/async');
const Report = require('../models/Report');

exports.createReport = asyncHandler(async function(req, res, next) {
	req.body.user = req.user._id;
	const report = await new Report(req.body);
	res.status(200).json({ success: true, data: report });
});
