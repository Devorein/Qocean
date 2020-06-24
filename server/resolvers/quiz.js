const {
	createQuizHandler,
	deleteQuizHandler,
	quizPhotoUpload,
	updatePlayedTimesHandler
} = require('../controllers/quizzes');
const updateResource = require('../utils/updateResource');
const watchAction = require('../utils/watchAction');
const addRatings = require('../utils/addRatings');
const parsePagination = require('../utils/parsePagination');

module.exports = {
	Query: {
		// ? All mixed
		async getAllMixedQuizzes(parent, args, { Quiz }, info) {
			return await Quiz.find({ public: true }).select('-public -favourite');
		},
		async getAllMixedQuizzesName(parent, args, { Quiz }) {
			return await Quiz.find({ public: true }).select('name');
		},

		async getAllMixedQuizzesCount(parent, args, { Quiz }) {
			return await Quiz.countDocuments({ public: true });
		},

		// ? All Others
		async getAllOthersQuizzes(parent, args, { user, Quiz }, info) {
			if (!user) throw new Error('Not authorized to access this route').select('-public -favourite');
			return await Quiz.find({ public: true, user: { $ne: user.id } });
		},
		async getAllOthersQuizzesName(parent, args, { user, Quiz }) {
			if (!user) throw new Error('Not authorized to access this route');
			return await Quiz.find({ public: true, user: { $ne: user.id } }).select('name');
		},
		async getAllOthersQuizzesCount(parent, args, { user, Quiz }) {
			if (!user) throw new Error('Not authorized to access this route');
			return await Quiz.countDocuments({ public: true, user: { $ne: user.id } });
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
		async getAllSelfQuizzesQuestionsStats(parent, args, { user, Quiz }) {
			if (!user) throw new Error('Not authorized to access this route');
			return await Quiz.find({ user: user.id })
				.populate({ path: 'questions', select: 'difficulty time_allocated name type' })
				.select('name questions');
		},

		// ? Paginated Mixed
		async getPaginatedMixedQuizzes(parent, { pagination }, { Quiz }) {
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await Quiz.find({ ...filter, public: true })
				.sort(sort)
				.skip(page)
				.limit(limit)
				.select('-public -favourite');
		},

		async getPaginatedMixedQuizzesName(parent, { pagination }, { user, Quiz }) {
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await Quiz.find({ ...filter, public: true }).sort(sort).skip(page).limit(limit).select('name');
		},

		async getFilteredMixedQuizzesCount(parent, { filter = '{}' }, { Quiz }) {
			return await Quiz.countDocuments({ ...JSON.parse(filter), public: true });
		},

		// ? Paginated Others
		async getPaginatedOthersQuizzes(parent, { pagination }, { user, Quiz }) {
			if (!user) throw new Error('Not authorized to access this route');
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await Quiz.find({ ...filter, public: true, user: { $ne: user.id } })
				.sort(sort)
				.skip(page)
				.limit(limit)
				.select('-public -favourite');
		},

		async getPaginatedOthersQuizzesName(parent, { pagination }, { user, Quiz }) {
			if (!user) throw new Error('Not authorized to access this route');
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await Quiz.find({ ...filter, public: true, user: { $ne: user.id } })
				.sort(sort)
				.skip(page)
				.limit(limit)
				.select('name');
		},

		async getFilteredOthersQuizzesCount(parent, { filter = '{}' }, { user, Quiz }) {
			if (!user) throw new Error('Not authorized to access this route');
			const count = await Quiz.countDocuments({ ...JSON.parse(filter), public: true, user: { $ne: user.id } });
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
			const [ quiz ] = await Quiz.find({ _id: id, public: true }).select('-public -favourite');
			if (!quiz) throw new Error('Resource with that Id doesnt exist');
			return quiz;
		},

		// ? Id Others
		async getOthersQuizzesById(parent, { id }, { user, Quiz }) {
			if (!user) throw new Error('Not authorized to access this route');
			const [ quiz ] = await Quiz.find({ _id: id, user: { $ne: user.id }, public: true }).select(
				'-public -favourite'
			)[0];
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
	},
	Mutation: {
		async createQuiz(parent, { data }, { user, Quiz }) {
			if (!user) throw new Error('Not authorized to access this route');
			return await createQuizHandler(user.id, data, (err) => {
				throw err;
			});
		},
		async updateQuiz(parent, { data }, { user, Quiz }) {
			if (!user) throw new Error('Not authorized to access this route');
			const [ updated_quiz ] = await updateResource(Quiz, [ data ], user.id, (err) => {
				throw err;
			});
			return updated_quiz;
		},

		async updateQuizzes(parent, { data }, { user, Quiz }) {
			if (!user) throw new Error('Not authorized to access this route');
			return await updateResource(Quiz, data, user.id, (err) => {
				throw err;
			});
		},
		async updateQuizPlayedTimes(parent, { ids }, { user, Quiz }) {
			if (!user) throw new Error('Not authorized to access this route');
			return await updatePlayedTimesHandler(ids, user.id);
		},
		async updateQuizRatings(parent, { data }, { user, Quiz }) {
			if (!user) throw new Error('Not authorized to access this route');
			return await addRatings(Quiz, data, user.id, (err) => {
				throw err;
			});
		},
		async updateQuizWatch(parent, { ids }, { user, User }) {
			if (!user) throw new Error('Not authorized to access this route');
			user = await User.findById(user.id);
			return watchAction('quizzes', { quizzes: ids }, user);
		},
		async deleteQuiz(parent, { id }, { user, Quiz }) {
			if (!user) throw new Error('Not authorized to access this route');
			const [ quiz ] = await deleteQuizHandler([ id ], user.id, (err) => {
				throw err;
			});
			return quiz;
		},
		async deleteQuizzes(parent, { ids }, { user, Quiz }) {
			if (!user) throw new Error('Not authorized to access this route');
			return await deleteQuizHandler(ids, user.id, (err) => {
				throw err;
			});
		}
	}
};
