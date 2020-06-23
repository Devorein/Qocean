const parsePagination = require('../utils/parsePagination');
const {
	createQuiz,
	updateQuiz,
	deleteQuiz,
	deleteQuizzes,
	quizPhotoUpload,
	updatePlayedTimes,
	updateQuizRatings,
	watchQuizzes,
	updateQuizzes,
	getAllTags,
	playPageQuiz
} = require('../controllers/quizzes');

module.exports = {
	Query: {
		// ? All mixed
		async getAllMixedQuizzes(parent, args, { Quiz }, info) {
			return await Quiz.find({}).select('-public -favourite');
		},
		async getAllMixedQuizzesName(parent, args, { Quiz }) {
			return await Quiz.find({}).select('name');
		},

		async getAllMixedQuizzesCount(parent, args, { Quiz }) {
			return await Quiz.countDocuments({});
		},

		// ? All Others
		async getAllOthersQuizzes(parent, args, { user, Quiz }, info) {
			if (!user) throw new Error('Not authorized to access this route').select('-public -favourite');
			return await Quiz.find({ user: { $ne: user.id } });
		},
		async getAllOthersQuizzesName(parent, args, { user, Quiz }) {
			if (!user) throw new Error('Not authorized to access this route');
			return await Quiz.find({ user: { $ne: user.id } }).select('name');
		},
		async getAllOthersQuizzesCount(parent, args, { user, Quiz }) {
			if (!user) throw new Error('Not authorized to access this route');
			return await Quiz.countDocuments({ user: { $ne: user.id } });
		},

		// ? All Self
		async getAllSelfQuizzes(parent, args, { user, Quiz }, info) {
			if (!user) throw new Error('Not authorized to access this route');
			return await Quiz.find({ user: user.id });
		},
		async getAllSelfQuizzesName(parent, args, { user, Quiz }) {
			if (!user) throw new Error('Not authorized to access this route');
			return await Quiz.find({ user: user.id }).select('name');
		},
		async getAllSelfQuizzesCount(parent, args, { user, Quiz }) {
			if (!user) throw new Error('Not authorized to access this route');
			return await Quiz.countDocuments({ user: user.id });
		},

		// ? Paginated Mixed
		async getPaginatedMixedQuizzes(parent, { pagination }, { Quiz }) {
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await Quiz.find(filter).sort(sort).skip(page).limit(limit).select('-public -favourite');
		},

		async getPaginatedMixedQuizzesName(parent, { pagination }, { user, Quiz }) {
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await Quiz.find(filter).sort(sort).skip(page).limit(limit).select('name');
		},

		async getFilteredMixedQuizzesCount(parent, { filter = '{}' }, { Quiz }) {
			return await Quiz.countDocuments(JSON.parse(filter));
		},

		// ? Paginated Others
		async getPaginatedOthersQuizzes(parent, { pagination }, { user, Quiz }) {
			if (!user) throw new Error('Not authorized to access this route');
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await Quiz.find({ ...filter, user: { $ne: user.id } })
				.sort(sort)
				.skip(page)
				.limit(limit)
				.select('-public -favourite');
		},

		async getPaginatedOthersQuizzesName(parent, { pagination }, { user, Quiz }) {
			if (!user) throw new Error('Not authorized to access this route');
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await Quiz.find({ ...filter, user: { $ne: user.id } }).sort(sort).skip(page).limit(limit).select('name');
		},

		async getFilteredOthersQuizzesCount(parent, { filter = '{}' }, { user, Quiz }) {
			if (!user) throw new Error('Not authorized to access this route');
			const count = await Quiz.countDocuments({ ...JSON.parse(filter), user: { $ne: user.id } });
			return count;
		},

		// ? Paginated Self
		async getPaginatedSelfQuizzes(parent, { pagination }, { user, Quiz }) {
			if (!user) throw new Error('Not authorized to access this route');
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await Quiz.find({ ...filter, user: user.id }).sort(sort).skip(page).limit(limit);
		},

		async getPaginatedSelfQuizzesName(parent, { pagination }, { user, Quiz }) {
			if (!user) throw new Error('Not authorized to access this route');
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await Quiz.find({ ...filter, user: user.id }).sort(sort).skip(page).limit(limit).select('name');
		},

		async getFilteredSelfQuizzesCount(parent, { filter = '{}' }, { user, Quiz }) {
			if (!user) throw new Error('Not authorized to access this route');
			const count = await Quiz.countDocuments({ ...JSON.parse(filter), user: user.id });
			return count;
		},

		// ? Id mixed
		async getMixedQuizzesById(parent, { id }, { Quiz }) {
			const quiz = await Quiz.findById(id).select('-public -favourite');
			if (!quiz) throw new Error('Resource with that Id doesnt exist');
			return quiz;
		},

		// ? Id Others
		async getOthersQuizzesById(parent, { id }, { user, Quiz }) {
			if (!user) throw new Error('Not authorized to access this route');
			const [ quiz ] = await Quiz.find({ _id: id, user: { $ne: user.id } }).select('-public -favourite')[0];
			if (!quiz) throw new Error('Resource with that Id doesnt exist');
			return quiz;
		},

		// ? Id Self
		async getSelfQuizzesById(parent, { id }, { user, Quiz }) {
			if (!user) throw new Error('Not authorized to access this route');
			const [ quiz ] = await Quiz.find({ _id: id, user: user.id });
			if (!quiz) throw new Error('Resource with that Id doesnt exist');
			return quiz;
		}
	}
};
