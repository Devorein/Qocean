const mongoose = require('mongoose');
const extendSchema = require('../utils/extendSchema');
const ResourceSchema = require('./Resource');

const EnvironmentSchema = extendSchema(ResourceSchema, {
	name: {
		type: String,
		required: [ true, 'Please provide the name of the environment' ]
	},
	icon: {
		type: String,
		enum: [
			'Red_env.svg',
			'Orange_env.svg',
			'Yellow_env.svg',
			'Green_env.svg',
			'Blue_env.svg',
			'Indigo_env.svg',
			'Violet_env.svg'
		],
		default: 'Red_env.svg'
	},
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
	default_quiz_time: {
		type: Number,
		default: 30
	},
	default_quiz_difficulty: {
		type: String,
		default: 'Beginner',
		enum: [ 'Beginner', 'Intermediate', 'Advanced' ]
	},
	default_quiz_weight: {
		type: Number,
		default: 1,
		min: [ 1, 'Weight cant be less than 1' ],
		max: [ 10, 'Weight cant be less than 10' ]
	},
	reset_on_success: {
		type: Boolean,
		default: true
	},
	reset_on_error: {
		type: Boolean,
		default: false
	},
	notification_timing: {
		type: Number,
		default: 2500,
		min: 1000,
		max: 5000
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
