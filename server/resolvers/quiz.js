const { updatePlayedTimesHandler } = require('../handlers/quiz');

const QuizResolvers = {
	resolver: {
		Query: {
			async getAllSelfQuizzesQuestionsStats(parent, args, { user, Quiz }) {
				return await Quiz.find({ user: user.id })
					.populate({ path: 'questions', select: 'difficulty time_allocated name type' })
					.select('name questions');
			}
		},
		Mutation: {
			async updateQuizPlayedTimes(parent, { ids }, { user, Quiz }) {
				return await updatePlayedTimesHandler(ids, user.id);
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
	},
	generate: true
};

module.exports = QuizResolvers;
