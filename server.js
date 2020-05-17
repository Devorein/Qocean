const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileupload = require('express-fileupload');
const mongoSanitize = require('express-mongo-sanitize');

const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

dotenv.config({ path: './config/config.env' });

const quizzes = require('./routes/quizzes');
const questions = require('./routes/questions');
const auth = require('./routes/auth');
const user = require('./routes/user');
const folder = require('./routes/folders');
const environment = require('./routes/environment');

connectDB();

const app = express();

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(cors());
app.use(express.json());
app.use(fileupload());
app.use(mongoSanitize());
app.use(helmet());
app.use(xssClean());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/v1/quizzes', quizzes);
app.use('/api/v1/questions', questions);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', user);
app.use('/api/v1/folders', folder);
app.use('/api/v1/environments', environment);
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
