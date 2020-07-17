const {
	validateQuestionHandler,
	sendAnswerHandler
} = require('../handlers/question');

const QuestionResolvers = {
	Query: {
		async getMixedQuestionsByIdAnswers(parent, { id }) {
			const [questions] = await sendAnswerHandler([id], (err) => {
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
			return await validateQuestionHandler([data], (err) => {
				throw err;
			});
		},

		async getMixedQuestionsByIdsValidation(parent, { data }) {
			return await validateQuestionHandler(data, (err) => {
				throw err;
			});
		}
	},
	Mutation: {}
};

module.exports = QuestionResolvers;
