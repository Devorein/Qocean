const { createQuizHandler, deleteQuizHandler, updatePlayedTimesHandler } = require('../handlers/quiz');

const updateResource = require('../utils/updateResource');
const watchAction = require('../utils/watchAction');
const addRatings = require('../utils/addRatings');
const resolverCompose = require('../utils/resolverCompose');
const generateQueryResolvers = require('../utils/generateQueryResolvers');

const QuizResolvers = {
	Query: {
		...generateQueryResolvers('quiz'),
		async getAllSelfQuizzesQuestionsStats(parent, args, { user, Quiz }) {
			return await Quiz.find({ user: user.id })
				.populate({ path: 'questions', select: 'difficulty time_allocated name type' })
				.select('name questions');
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
