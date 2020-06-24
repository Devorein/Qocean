const mongoose = require('mongoose');
const extendSchema = require('../utils/extendSchema');
const ResourceSchema = require('./Resource');

const envSchema = {
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
	hovertips: {
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

	default_create_landing: {
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
	max_notifications: {
		type: Number,
		default: 3
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
	},
	display_font: {
		type: String,
		default: 'Quantico'
	}
};

envSchema.keybindings = {
	CHECK: {
		type: String,
		default: 's'
	},
	MOVE_UP: {
		type: String,
		default: 'up'
	},
	MOVE_DOWN: {
		type: String,
		default: 'down'
	}
};

Array(5).fill(0).forEach((_, i) => {
	envSchema.keybindings[`LOCAL_ACTION_${i + 1}`] = {
		type: String,
		default: `${i + 1}`
	};
	envSchema.keybindings[`GLOBAL_ACTION_${i + 1}`] = {
		type: String,
		default: `shift+${i + 1}`
	};
});

[ 'explore', 'self', 'watchlist', 'play' ].forEach((page) => {
	const target = {};
	envSchema[`${page}_page`] = target;

	target[`default_ipp`] = {
		type: Number,
		default: 15
	};

	target[`default_view`] = {
		type: String,
		default: 'List'
	};

	if (page !== 'play') {
		target[`default_landing`] = {
			type: String,
			default: 'Quiz'
		};
		target[`default_layout`] = {
			type: String,
			default: 'Left'
		};
	}
});

const EnvironmentSchema = extendSchema(ResourceSchema, envSchema);

EnvironmentSchema.pre('save', async function(next) {
	await this.model('User').add(this.user, 'environments', this._id);
	next();
});

EnvironmentSchema.pre('remove', async function(next) {
	// await this.model('User').remove(this.user, 'environments', this._id);
	next();
});

module.exports = mongoose.model('Environment', EnvironmentSchema);
