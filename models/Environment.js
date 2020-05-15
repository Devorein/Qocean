const mongoose = require('mongoose');
const extendSchema = require('../utils/extendSchema');
const ResourceSchema = require('./Resource');

const EnvironmentSchema = extendSchema(ResourceSchema, {
	theme: {
		type: String,
		default: 'Light'
	},
	animation: {
		type: Boolean,
		default: true
	},
	sound: {
		type: Boolean,
		default: true
	},
	defaultTimeAllocated: {
		type: Number,
		default: 30
	}
});

EnvironmentSchema.pre('save', async function(next) {
	await this.model('User').add(this.user, 'environments', this._id);
	next();
});

EnvironmentSchema.pre('remove', async function(next) {
	await this.model('User').remove(this.user, 'environments', this._id);
	next();
});

module.exports = mongoose.model('Environment', EnvironmentSchema);
