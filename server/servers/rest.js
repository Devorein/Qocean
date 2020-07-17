const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileupload = require('express-fileupload');
const colors = require('colors');

const errorHandler = require('../middleware/error');

const generateLimiter = require('../utils/generateLimiter');

module.exports = async function generateRestServer () {
	const REST = express();

	REST.use(cors());
	REST.use(express.json());
	REST.use(fileupload());
	REST.use(helmet());
	REST.use(xssClean());
	REST.use(generateLimiter());
	REST.use(express.static(path.join(__dirname, 'public')));
	REST.use(morgan('dev'));

	const { Routes } = require('../resource');

	// REST server

	Object.entries(Routes.obj).forEach(([ key, value ]) => {
		REST.use(`/api/v1/${key}`, value);
	});

	REST.use(cookieParser);
	REST.use(errorHandler);

	return {
		REST,
		start () {
			const { REST_PORT = 5000 } = process.env;
			REST.listen(REST_PORT, () => {
				console.log(
					colors.blue.bold(`REST Server running in ${process.env.NODE_ENV} mode on port http://localhost:${REST_PORT}`)
				);
			});
		}
	};
};
