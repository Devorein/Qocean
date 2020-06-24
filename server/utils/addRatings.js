module.exports = async function(Model, data, userId, next) {
	const ratingsData = [];
	for (let i = 0; i < data.length; i++) {
		const { id, ratings } = data[i];
		const resource = await Model.findById(id).select('user ratings raters');
		const prevRatings = parseFloat(resource.ratings);
		let newRatings = prevRatings;
		let raters = parseInt(resource.raters);
		if (resource.user.toString() !== userId.toString()) {
			raters++;
			resource.raters = raters;
			newRatings = parseFloat(((prevRatings + ratings[i]) / (raters !== 1 ? 2 : 1)).toFixed(2));
			resource.ratings = newRatings;
			await resource.save();
		}

		ratingsData.push({
			id: resource._id,
			prevRatings,
			newRatings,
			raters
		});
	}
	return ratingsData;
};
