const path = require('path');

const imageUpload = (generatedModels) =>
	async function (req, res, next) {
		if (!req.user) return next(new Error('User is not logged in'));
		const [ model_name, id ] = req.params.res_id.split('_');
		const model = generatedModels[model_name.charAt(0).toUpperCase() + model_name.substr(1)];
		const result = await model.findById(id);

		if (!result) return next(new Error(`${model_name} not found with id of ${id}`));
		if (result.user.toString() !== req.user._id.toString())
			return next(new Error(`User not authorized to upload image for this resource`));
		if (!req.files) return next(new Error(`Please upload a file`));
		const { file } = req.files;
		if (!file.mimetype.startsWith('image/')) return next(new Error(`Please upload an image file`));

		if (file.size > process.env.FILE_UPLOAD_SIZE)
			return next(new Error(`Photo larger than ${process.env.FILE_UPLOAD_SIZE / 1000000}mb`));

		file.name = `${model_name}_${result._id}${path.parse(file.name).ext}`;
		result.image = file.name;
		await result.save();
		file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
			if (err) return next(new Error(`Problem with file upload`));
			await model.findByIdAndUpdate(result._id, {
				image: file.name
			});
			res.imageUpload = { success: true, data: file.name };
			next();
		});
	};

module.exports = imageUpload;
