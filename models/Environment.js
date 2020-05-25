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
			'Purple_env.svg'
		],
		default: 'Red_env.svg'
	},
	theme: {
		type: String,
		default: 'Dark',
		enum: [ 'Light', 'Dark', 'Navy' ]
	},
	animation: {
		type: Boolean,
		default: true
	},
	sound: {
		type: Boolean,
		default: true
	},
	default_question_type: {
		type: String,
		default: 'MCQ',
		enum: [ 'FIB', 'Snippet', 'MCQ', 'MS', 'FC', 'TF' ]
	},
	default_question_difficulty: {
		type: String,
		default: 'Beginner',
		enum: [ 'Beginner', 'Intermediate', 'Advanced' ]
	},
	default_question_timing: {
		type: Number,
		default: 30,
		min: [ 15, 'Time allocated cant be less than 15 seconds' ],
		max: [ 120, 'Time allocated cant be more than 120 seconds' ]
	},
	default_question_weight: {
		type: Number,
		default: 1,
		min: [ 1, 'Weight cant be less than 1' ],
		max: [ 10, 'Weight cant be less than 10' ]
	},
	default_explore_landing: {
		type: String,
		default: 'User'
	},
	default_explore_rpp: {
		type: Number,
		default: 15
	},
	default_create_landing: {
		type: String,
		default: 'Quiz'
	},
	default_self_rpp: {
		type: Number,
		default: 15
	},
	default_self_landing: {
		type: String,
		default: 'Quiz'
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
	},
	default_tag_color: {
		type: String,
		default: '#000'
	},
	primary_color: {
		type: String,
		default: '#3f51b5'
	},
	secondary_color: {
		type: String,
		default: '#f50057'
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
