const mongoose = require('mongoose');

const FilterSortSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User'
	},
	type: {
		type: String,
		enum: [ 'User', 'Folder', 'Quiz', 'Question', 'Environment' ]
	},
	name: {
		type: String,
		required: [ true, 'Name is required' ]
	},
	filter: [
		{
			target: {
				type: String,
				required: 'Target is required'
			},
			mod: String,
			value: String,
			cond: {
				type: String,
				enum: [ 'and', 'or' ]
			}
		}
	],
	sort: [
		{
			target: String,
			order: {
				type: String,
				enum: [ 'asc', 'desc' ]
			}
		}
	]
});
module.exports = mongoose.model('FilterSort', FilterSortSchema);
