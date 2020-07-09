const { typeDefs: ExternalTypedefs } = require('graphql-scalars');

const AuthTypedefs = require('./Auth.js');
const UserTypedefs = require('./User.js');
const QuizTypedefs = require('./Quiz.js');
const QuestionTypedefs = require('./Question.js');
const FolderTypedefs = require('./Folder.js');
const EnvironmentTypedefs = require('./Environment.js');
const WatchlistTypedefs = require('./Watchlist.js');
const FiltersortTypedefs = require('./FilterSort.js');
const ReportTypedefs = require('./Report.js');
const InboxTypedefs = require('./Inbox.js');
const MessageTypedefs = require('./Message.js');
const BaseTypedefs = require('./Base.js');

global.Typedefs = {};

module.exports = {
	Base: BaseTypedefs,
	Auth: AuthTypedefs,
	User: UserTypedefs,
	Quiz: QuizTypedefs,
	Question: QuestionTypedefs,
	Folder: FolderTypedefs,
	Environment: EnvironmentTypedefs,
	Watchlist: WatchlistTypedefs,
	Filtersort: FiltersortTypedefs,
	Report: ReportTypedefs,
	Inbox: InboxTypedefs,
	Message: MessageTypedefs,
	External: ExternalTypedefs
};
