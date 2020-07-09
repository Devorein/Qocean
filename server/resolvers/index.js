const { resolvers: ExternalResolvers } = require('graphql-scalars');

const AuthResolvers = require('./auth');
const UserResolvers = require('./user');
const QuizResolvers = require('./quiz');
const QuestionResolvers = require('./question');
const FolderResolvers = require('./folder');
const EnvironmentResolvers = require('./environment');
const WatchlistResolvers = require('./watchlist');
const FilterSortResolvers = require('./filtersort');
const ReportResolvers = require('./report');
const InboxResolvers = require('./inbox');
const MessaggeResolvers = require('./message');
const BaseResolvers = require('./base');

module.exports = {
	Auth: AuthResolvers,
	Base: BaseResolvers,
	User: UserResolvers,
	Quiz: QuizResolvers,
	Question: QuestionResolvers,
	Folder: FolderResolvers,
	Environment: EnvironmentResolvers,
	Watchlist: WatchlistResolvers,
	Filtersort: FilterSortResolvers,
	Report: ReportResolvers,
	Inbox: InboxResolvers,
	Messagge: MessaggeResolvers,
	External: ExternalResolvers
};
