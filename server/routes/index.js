const auth = require('./auth');
const quizzes = require('./quizzes');
const questions = require('./questions');
const users = require('./user');
const folders = require('./folders');
const environments = require('./environment');
const reports = require('./report');
const watchlists = require('./watchlist');
const filtersorts = require('./filtersort');

module.exports = {
	auth,
	quizzes,
	questions,
	users,
	folders,
	environments,
	reports,
	watchlists,
	filtersorts
};
