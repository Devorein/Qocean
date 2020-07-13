const mongoose = require('mongoose');

const filterItem = {
	target: {
		type: String,
		required: true
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
		required: true
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
		required: true,
		mongql: {
			writable: false
		}
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
FilterSortSchema.mongql = {
	generate: {
		mutation: true,
		type: true
	},
	resource: 'filtersort',
	global_excludePartitions: {
		base: [ 'Others', 'Mixed' ]
	}
};

module.exports.FilterSortModel = mongoose.model('Filtersort', FilterSortSchema);
