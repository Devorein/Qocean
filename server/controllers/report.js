const asyncHandler = require('../middleware/async');
const { ReportModel } = require('../models/Report');

exports.createReport = asyncHandler(async function(req, res) {
	req.body.user = req.user._id;
	const report = await new ReportModel(req.body);
	res.status(200).json({ success: true, data: report });
});
