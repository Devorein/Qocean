const mongoose = require('mongoose');
const extendSchema = require('../utils/extendSchema');
const ResourceSchema = require('./Resource');

const PageInfo = {
	default_ipp: {
		type: Number,
		default: 15,
		mongql: {
			scalar: 'PositiveInt'
		}
	},
	default_view: {
		type: String,
		default: 'List'
	},
	default_landing: {
		type: String,
		default: 'Quiz'
	},
	default_layout: {
		type: String,
		default: 'Left'
	}
};

const QuestionInfo = new mongoose.Schema({
	default_type: {
		type: String,
		default: 'MCQ',
		enum: [ 'FIB', 'Snippet', 'MCQ', 'MS', 'FC', 'TF' ]
	},
	default_difficulty: {
		type: String,
		default: 'Beginner',
		enum: [ 'Beginner', 'Intermediate', 'Advanced' ]
	},
	default_timing: {
		type: Number,
		default: 30,
		min: [ 15, 'Time allocated cant be less than 15 seconds' ],
		max: [ 120, 'Time allocated cant be more than 120 seconds' ],
		mongql: {
			scalar: 'PositiveInt'
		}
	},
	default_weight: {
		type: Number,
		default: 1,
		min: [ 1, 'Weight cant be less than 1' ],
		max: [ 10, 'Weight cant be less than 10' ],
		mongql: {
			scalar: 'PositiveInt'
		}
	}
});

const envSchema = {
	name: {
		type: String,
		required: [ true, 'Please provide the name of the environment' ]
	},
	icon: {
		type: String,
		enum: [ 'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Indigo', 'Purple' ],
		default: 'Red'
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
	question_info: QuestionInfo,
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
		max: 5000,
		mongql: {
			scalar: 'PositiveInt'
		}
	},
	default_tag_color: {
		type: String,
		default: '#000',
		mongql: {
			scalar: 'HexColorCode'
		}
	},
	primary_color: {
		type: String,
		default: '#3f51b5',
		mongql: {
			scalar: 'HexColorCode'
		}
	},
	secondary_color: {
		type: String,
		default: '#f50057',
		mongql: {
			scalar: 'HexColorCode'
		}
	},
	display_font: {
		type: String,
		default: 'Quantico'
	}
};

const keybindings = {
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
	keybindings[`LOCAL_ACTION_${i + 1}`] = {
		type: String,
		default: `${i + 1}`
	};
	keybindings[`GLOBAL_ACTION_${i + 1}`] = {
		type: String,
		default: `shift+${i + 1}`
	};
});

envSchema.keybindings = new mongoose.Schema(keybindings);

[ 'explore', 'self', 'watchlist', 'play' ].forEach((page) => {
	envSchema[`${page}_page`] = new mongoose.Schema(PageInfo);
	envSchema[`${page}_page`].type = 'PageInfo';
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

EnvironmentSchema.mongql = {
	generate: true,
	resource: 'environment'
};

exports.EnvironmentSchema = EnvironmentSchema;
exports.EnvironmentModel = mongoose.model('Environment', EnvironmentSchema);
