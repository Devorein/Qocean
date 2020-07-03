const { validateQuestionHandler, sendAnswerHandler } = require('../handlers/question');

const resolverCompose = require('../utils/resolverCompose');
const generateQueryResolvers = require('../utils/graphql/generateQueryResolvers');
const generateMutationResolvers = require('../utils/graphql/generateMutationResolvers');
const generateTypeResolvers = require('../utils/graphql/generateTypeResolvers');

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
		}
	},
	Mutation: {
		...generateMutationResolvers('question')
	},
	...generateTypeResolvers('question')
};

module.exports = resolverCompose(QuestionResolvers);
