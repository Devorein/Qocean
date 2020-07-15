module.exports = function (page, limit) {
	page = parseInt(page) || 1;
	limit = parseInt(limit) || 10;
	const startIndex = (page - 1) * limit;
	return [startIndex, limit];
};
