const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
	favourite: {
		type: Boolean,
		default: false,
		excludePartitions: [ 'Others', 'Mixed' ]
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: [ true, 'Please provide an user' ],
		graphql: {
			writable: false
		}
	},
	public: {
		type: Boolean,
		default: true,
		excludePartitions: [ 'Others', 'Mixed' ]
	},
	created_at: {
		type: Date,
		default: Date.now,
		graphql: {
			writable: false
		},
		excludePartitions: [ 'Others', 'Mixed' ]
	},
	updated_at: {
		type: Date,
		default: Date.now,
		graphql: {
			writable: false
		}
	}
});

module.exports = ResourceSchema;
