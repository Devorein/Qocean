const ErrorResponse = require('../errorResponse');

module.exports = async function(Model, datas, userId, next) {
	const updated_resources = [];
	for (let i = 0; i < datas.length; i++) {
		const data = datas[i];
		const resource = await Model.findById(data.id);
		if (!resource) return next(new ErrorResponse(`Resource not found with id of ${data.id}`, 404));
		if (resource.user.toString() !== userId.toString())
			return next(new ErrorResponse(`User not authorized to update this quiz`, 401));
		data.updated_at = Date.now();
		delete data.id;
		Object.entries(data).forEach(([ key, value ]) => {
			resource[key] = value;
		});
		updated_resources.push(await resource.save());
	}
	return updated_resources;
};
