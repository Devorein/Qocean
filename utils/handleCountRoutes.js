module.exports = async function handleCountRoutes(filters, req, res, model) {
	if (req.route.path.includes('count')) {
		if (req.route.path === '/countAll') {
			if (model.modelName !== 'User') filters.public = true;
		} else if (req.route.path === '/countMine') filters.user = req.user._id;
		else if (req.route.path === '/countOthers') {
			if (model.modelName !== 'User') {
				filters.public = true;
				filters.user = { $ne: req.user._id };
			} else filters._id = { $ne: req.user._id };
		}
		console.log(filters);
		const count = await model.countDocuments(filters);
		res.status(200).json({ success: true, data: count });
		return false;
	}
	return true;
};
