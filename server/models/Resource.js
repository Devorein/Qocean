const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
	favourite: {
		type: Boolean,
		default: false,
		onlySelf: true
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: [ true, 'Please provide an user' ],
		writable: false
	},
	public: {
		type: Boolean,
		default: true,
		onlySelf: true
	},
	created_at: {
		type: Date,
		default: Date.now,
		writable: false,
		onlySelf: true
	},
	updated_at: {
		type: Date,
		default: Date.now,
		writable: false
	}
});

module.exports = ResourceSchema;
