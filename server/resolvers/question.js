const updateResource = require('../utils/resource/updateResource');

const {
	createQuestionHandler,
	deleteQuestionHandler,
	validateQuestionHandler,
	sendAnswerHandler,
	getOthersQuestionsHandler
} = require('../handlers/question');

const resolverCompose = require('../utils/resolverCompose');
const generateQueryResolvers = require('../utils/graphql/generateQueryResolvers');

const QuestionResolvers = {
	Query: {
		...generateQueryResolvers('question'),

		async getMixedQuestionsByIdAnswers(parent, { id }) {
			const [ questions ] = await sendAnswerHandler([ id ], (err) => {
				throw err;
			});
			return questions;
		},

		async getMixedQuestionsByIdsAnswers(parent, { ids }) {
			return await sendAnswerHandler(ids, (err) => {
				throw err;
			});
		},

		async getMixedQuestionsByIdValidation(parent, { data }) {
			return await validateQuestionHandler([ data ], (err) => {
				throw err;
			});
		},

		async getMixedQuestionsByIdsValidation(parent, { data }) {
			return await validateQuestionHandler(data, (err) => {
				throw err;
			});
		},

		// ? Id Others
		async getOthersQuestionsById(parent, { id }, { user, Question }) {
			const [ question ] = await Question.find({ _id: id, user: { $ne: user.id }, public: true }).select(
				'-public -favourite'
			)[0];
			if (!question) throw new Error('Resource with that Id doesnt exist');
			return question;
		},

		// ? Id Self
		async getSelfQuestionsById(parent, { id }, { user, Question }) {
			const [ question ] = await Question.find({ _id: id, user: user.id });
			if (!question) throw new Error('Resource with that Id doesnt exist');
			return question;
		}
	},
	Mutation: {
		async createQuestion(parent, { data }, { user }) {
			return await createQuestionHandler(data, user.id, (err) => {
				throw err;
			});
		},
		async updateQuestion(parent, { data }, { user, Question }) {
			const [ updated_question ] = await updateResource(Question, [ data ], user.id, (err) => {
				throw err;
			});
			return updated_question;
		},

		async updateQuestions(parent, { data }, { user, Question }) {
			return await updateResource(Question, data, user.id, (err) => {
				throw err;
			});
		},
		async deleteQuestion(parent, { id }, { user, Question }) {
			const [ question ] = await deleteQuestionHandler([ id ], user.id, (err) => {
				throw err;
			});
			return question;
		},
		async deleteQuestions(parent, { ids }, { user, Question }) {
			return await deleteQuestionHandler(ids, user.id, (err) => {
				throw err;
			});
		}
	},
	SelfQuestion: {
		difficulty(parent, args) {
			return parent.difficulty;
		},
		type(parent) {
			return parent.type;
		},
		async quiz(parent, args, { Quiz }) {
			return await Quiz.find({ user: parent.user });
		}
	},
	OthersQuestion: {
		difficulty(parent, args) {
			return parent.difficulty;
		},
		type(parent) {
			return parent.type;
		},
		async quiz(parent, args, { Quiz }) {
			return await Quiz.find({ user: parent.user, public: true }).select('-public -favourite');
		}
	}
};

module.exports = resolverCompose(QuestionResolvers);
