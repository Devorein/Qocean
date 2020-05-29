const ErrorResponse = require('../utils/errorResponse');
const path = require('path');

const imageUpload = (model, name) =>
	async function(req, res, next) {
		const result = await model.findById(req.params.id);
		if (!result) return next(new ErrorResponse(`${name} not found with id of ${req.params.id}`, 404));
		if (!req.baseUrl.split('/').includes('users'))
			if (result.user.toString() !== req.user._id.toString())
				return next(new ErrorResponse(`User not authorized to upload image for this resource`, 401));
		if (!req.files) return next(new ErrorResponse(`Please upload a file`, 400));
		const { file } = req.files;
		if (!file.mimetype.startsWith('image/')) return next(new ErrorResponse(`Please upload an image file`, 400));

		if (file.size > process.env.FILE_UPLOAD_SIZE)
			return next(new ErrorResponse(`Photo larger than ${process.env.FILE_UPLOAD_SIZE / 1000000}mb`, 400));

		file.name = `${name}_${result._id}${path.parse(file.name).ext}`;
		result.image = file.name;
		await result.save();
		file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
			if (err) return next(new ErrorResponse(`Problem with file upload`, 500));
			await model.findByIdAndUpdate(result._id, {
				image: file.name
			});
			res.imageUpload = { success: true, data: file.name };
			next();
		});
	};

module.exports = imageUpload;
