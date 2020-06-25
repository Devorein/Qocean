const { createQuizHandler, deleteQuizHandler, updatePlayedTimesHandler } = require('../handlers/quiz');

const updateResource = require('../utils/updateResource');
const watchAction = require('../utils/watchAction');
const addRatings = require('../utils/addRatings');
const parsePagination = require('../utils/parsePagination');
const resolverCompose = require('../utils/resolverCompose');

const QuizResolvers = {
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
			return await Quiz.find({ public: true, user: { $ne: user.id } }).select('-public -favourite');
		},
		async getAllOthersQuizzesName(parent, args, { user, Quiz }) {
			return await Quiz.find({ public: true, user: { $ne: user.id } }).select('name');
		},
		async getAllOthersQuizzesCount(parent, args, { user, Quiz }) {
			return await Quiz.countDocuments({ public: true, user: { $ne: user.id } });
		},

		// ? All Self
		async getAllSelfQuizzes(parent, args, { user, Quiz }, info) {
			return await Quiz.find({ user: user.id });
		},
		async getAllSelfQuizzesName(parent, args, { user, Quiz }) {
			return await Quiz.find({ user: user.id }).select('name');
		},
		async getAllSelfQuizzesCount(parent, args, { user, Quiz }) {
			return await Quiz.countDocuments({ user: user.id });
		},
		async getAllSelfQuizzesQuestionsStats(parent, args, { user, Quiz }) {
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
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await Quiz.find({ ...filter, public: true, user: { $ne: user.id } })
				.sort(sort)
				.skip(page)
				.limit(limit)
				.select('-public -favourite');
		},

		async getPaginatedOthersQuizzesName(parent, { pagination }, { user, Quiz }) {
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await Quiz.find({ ...filter, public: true, user: { $ne: user.id } })
				.sort(sort)
				.skip(page)
				.limit(limit)
				.select('name');
		},

		async getFilteredOthersQuizzesCount(parent, { filter = '{}' }, { user, Quiz }) {
			const count = await Quiz.countDocuments({ ...JSON.parse(filter), public: true, user: { $ne: user.id } });
			return count;
		},

		// ? Paginated Self
		async getPaginatedSelfQuizzes(parent, { pagination }, { user, Quiz }) {
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await Quiz.find({ ...filter, user: user.id }).sort(sort).skip(page).limit(limit);
		},

		async getPaginatedSelfQuizzesName(parent, { pagination }, { user, Quiz }) {
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await Quiz.find({ ...filter, user: user.id }).sort(sort).skip(page).limit(limit).select('name');
		},

		async getFilteredSelfQuizzesCount(parent, { filter = '{}' }, { user, Quiz }) {
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
			const [ quiz ] = await Quiz.find({ _id: id, user: { $ne: user.id }, public: true }).select(
				'-public -favourite'
			)[0];
			if (!quiz) throw new Error('Resource with that Id doesnt exist');
			return quiz;
		},

		// ? Id Self
		async getSelfQuizzesById(parent, { id }, { user, Quiz }) {
			const [ quiz ] = await Quiz.find({ _id: id, user: user.id });
			if (!quiz) throw new Error('Resource with that Id doesnt exist');
			return quiz;
		}
	},
	Mutation: {
		async createQuiz(parent, { data }, { user, Quiz }) {
			return await createQuizHandler(user.id, data, (err) => {
				throw err;
			});
		},
		async updateQuiz(parent, { data }, { user, Quiz }) {
			const [ updated_quiz ] = await updateResource(Quiz, [ data ], user.id, (err) => {
				throw err;
			});
			return updated_quiz;
		},

		async updateQuizzes(parent, { data }, { user, Quiz }) {
			return await updateResource(Quiz, data, user.id, (err) => {
				throw err;
			});
		},
		async updateQuizPlayedTimes(parent, { ids }, { user, Quiz }) {
			return await updatePlayedTimesHandler(ids, user.id);
		},
		async updateQuizRatings(parent, { data }, { user, Quiz }) {
			return await addRatings(Quiz, data, user.id, (err) => {
				throw err;
			});
		},
		async updateQuizWatch(parent, { ids }, { user, User }) {
			user = await User.findById(user.id);
			return watchAction('quizzes', { quizzes: ids }, user);
		},
		async deleteQuiz(parent, { id }, { user, Quiz }) {
			const [ quiz ] = await deleteQuizHandler([ id ], user.id, (err) => {
				throw err;
			});
			return quiz;
		},
		async deleteQuizzes(parent, { ids }, { user, Quiz }) {
			return await deleteQuizHandler(ids, user.id, (err) => {
				throw err;
			});
		}
	},
	SelfQuiz: {
		average_difficulty(parent, args) {
			return parent.average_difficulty;
		},
		async watchers(parent, args, { User }) {
			return await User.find({ user: parent._id });
		},
		async questions(parent, args, { Question }) {
			return await Question.find({ user: parent._id });
		},
		async folders(parent, args, { Folder }) {
			return await Folder.find({ user: parent._id });
		}
	},
	OthersQuiz: {
		average_difficulty(parent, args) {
			return parent.average_difficulty;
		},
		async watchers(parent, args, { User }) {
			return await User.find({ user: parent._id });
		},
		async questions(parent, args, { Question }) {
			return await Question.find({ user: parent._id, public: true }).select('-public -favourite');
		},
		async folders(parent, args, { Folder }) {
			return await Folder.find({ user: parent._id, public: true }).select('-public -favourite');
		}
	},
	QuizQuestionStats: {
		async questions(parent, args, { Question }) {
			return await Question.find({ quiz: parent._id });
		}
	},
	QuestionStats: {
		difficulty(parent) {
			return parent.difficulty;
		},
		type(parent) {
			return parent.type;
		}
	}
};

module.exports = resolverCompose(QuizResolvers);
