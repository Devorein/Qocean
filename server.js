const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const errorHandler = require('./middleware/error');

const connectDB = require('./config/db');

// load env vars
dotenv.config({ path: './config/config.env' });

// Route files
const quizes = require('./routes/quizes');
const questions = require('./routes/questions');

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Dev loggin middleware
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Mount routers
app.use('/api/v1/quizes', quizes);
app.use('/api/v1/questions', questions);
app.use(errorHandler);

const { PORT = 5000 } = process.env;

const server = app.listen(PORT, () => {
	console.log(colors.yellow.bold(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
});

// handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
	console.log(`Error: ${err.message}`.red);
	// Close server and exit process
	server.close(() => process.exit(1));
});
