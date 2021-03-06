const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
	favourite: {
		type: Boolean,
		default: false,
		mongql: {
			excludePartitions: [ 'Others', 'Mixed' ]
		}
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: [ true, 'Please provide an user' ],
		mongql: {
			attach: {
				input: false
			}
		}
	},
	public: {
		type: Boolean,
		default: true,
		mongql: {
			excludePartitions: [ 'Others', 'Mixed' ]
		}
	},
	created_at: {
		type: Date,
		default: Date.now,
		mongql: {
			attach: {
				input: false
			},
			excludePartitions: [ 'Others', 'Mixed' ]
		}
	},
	updated_at: {
		type: Date,
		default: Date.now,
		mongql: {
			attach: {
				input: false
			}
		}
	}
});

ResourceSchema.mongql = {
	skip: true
};

module.exports = ResourceSchema;
