const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
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
    default :30
  }
	createdAt: {
		type: Date,
		default: Date.now
	},
	user: mongoose.Schema.ObjectId
});
