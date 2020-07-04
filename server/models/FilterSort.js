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

const FiltersSchema = new mongoose.Schema({
	...filterItem
});

FiltersSchema.add({ children: [ FiltersSchema ] });

const SortsSchema = new mongoose.Schema({
	target: {
		type: String,
		required: 'Target is required'
	},
	order: {
		type: String,
		enum: [ 'asc', 'desc', 'none' ]
	}
});

const FilterSortSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true
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
	filters: [ FiltersSchema ],
	sorts: [ SortsSchema ]
});

exports.FilterSortSchema = FilterSortSchema;
FilterSortSchema.global_partition = {
	base: false
};
module.exports.FilterSortModel = mongoose.model('Filtersort', FilterSortSchema);
