const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

const ErrorResponse = require('../errorResponse');

dotenv.config({ path: path.join(path.dirname(__dirname), 'config', 'config.env') });

mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
	useUnifiedTopology: true
});

module.exports = async function createResource() {};
