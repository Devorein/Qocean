const mongoose = require('mongoose');

const filterItem = {
	target: {
		type: String,
		required: 'Target is required'
	},
	mod: String,
	value: String,
	cond: {
		type: String,
		enum: [ 'and', 'or' ]
	},
	type: {
		type: String
	}
};

const FilterSortSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User'
	},
	type: {
		type: String,
		enum: [ 'User', 'Folder', 'Quiz', 'Question', 'Environment' ],
		required: [ true, 'Provide the filtersort type' ]
	},
	name: {
		type: String,
		required: [ true, 'Name is required' ]
	},
	filters: [
		{
			...filterItem,
			children: [ { ...filterItem } ]
		}
	],
	sorts: [
		{
			target: {
				type: String,
				required: 'Target is required'
			},
			order: {
				type: String,
				enum: [ 'asc', 'desc', 'none' ]
			}
		}
	]
});
module.exports = mongoose.model('FilterSort', FilterSortSchema);
