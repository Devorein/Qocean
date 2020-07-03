const { updatePlayedTimesHandler } = require('../handlers/quiz');

const resolverCompose = require('../utils/resolverCompose');
const generateQueryResolvers = require('../utils/graphql/generateQueryResolvers');
const generateMutationResolvers = require('../utils/graphql/generateMutationResolvers');
const generateTypeResolvers = require('../utils/graphql/generateTypeResolvers');

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
		...generateMutationResolvers('quiz'),
		async updateQuizPlayedTimes(parent, { ids }, { user, Quiz }) {
			return await updatePlayedTimesHandler(ids, user.id);
		}
	},
	...generateTypeResolvers('quiz'),
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
