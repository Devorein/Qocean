const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
	favourite: {
		type: Boolean,
		default: false
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: [ true, 'Please provide an user' ]
	},
	public: {
		type: Boolean,
		default: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

module.exports = ResourceSchema;
