const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const cookieParser = require('cookie-parser');
const fileupload = require('express-fileupload');

const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

dotenv.config({ path: './config/config.env' });

const quizes = require('./routes/quizes');
const questions = require('./routes/questions');
const auth = require('./routes/auth');
const user = require('./routes/user');

connectDB();

const app = express();

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(express.json());
app.use(fileupload());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/v1/quizes', quizes);
app.use('/api/v1/questions', questions);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', user);
app.use(cookieParser);
app.use(errorHandler);

const { PORT = 5000 } = process.env;

const server = app.listen(PORT, () => {
	console.log(colors.yellow.bold(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
});

process.on('unhandledRejection', (err, promise) => {
	console.log(`Error: ${err.message}`.red);
	server.close(() => process.exit(1));
});
