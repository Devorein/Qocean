const { UserModel, UserSchema } = require('./User');
const { QuizModel, QuizSchema } = require('./Quiz');
const { QuestionModel, QuestionSchema } = require('./Question');
const { FolderModel, FolderSchema } = require('./Folder');
const { EnvironmentModel, EnvironmentSchema } = require('./Environment');
const { ReportModel, ReportSchema } = require('./Report');
const { FilterSortModel, FilterSortSchema } = require('./FilterSort');
const { WatchlistModel, WatchlistSchema } = require('./Watchlist');
const { InboxModel, InboxSchema } = require('./Inbox');
const { MessageModel, MessageSchema } = require('./Message');

module.exports = {
	user: [ UserModel, UserSchema ],
	quiz: [ QuizModel, QuizSchema ],
	question: [ QuestionModel, QuestionSchema ],
	folder: [ FolderModel, FolderSchema ],
	environment: [ EnvironmentModel, EnvironmentSchema ],
	report: [ ReportModel, ReportSchema ],
	filtersort: [ FilterSortModel, FilterSortSchema ],
	watchlist: [ WatchlistModel, WatchlistSchema ],
	inbox: [ InboxModel, InboxSchema ],
	message: [ MessageModel, MessageSchema ]
};
