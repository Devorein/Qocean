const parsePagination = require('../utils/parsePagination');
const updateResource = require('../utils/updateResource');

const {
	createQuestionHandler,
	deleteQuestionHandler,
	validateQuestionHandler,
	sendAnswerHandler,
	questionPhotoUpload,
	getOthersQuestionsHandler
} = require('../controllers/questions');

module.exports = {
	Query: {
		// ? All mixed
		async getAllMixedQuestions(parent, args, { Question }, info) {
			return (await getOthersQuestionsHandler({})).data;
		},
		async getAllMixedQuestionsName(parent, args, { Question }) {
			return (await getOthersQuestionsHandler({ project: { name: 1 } })).data;
		},
		async getAllMixedQuestionsCount(parent, args, { Question }) {
			return (await getOthersQuestionsHandler()).total;
		},

		// ? All Others
		async getAllOthersQuestions(parent, args, { user, Question }, info) {
			if (!user) throw new Error('Not authorized to access this route').select('-public -favourite');
			return (await getOthersQuestionsHandler({ filters: { user: { $ne: user.id } } })).data;
		},
		async getAllOthersQuestionsName(parent, args, { user, Question }) {
			if (!user) throw new Error('Not authorized to access this route');
			return (await getOthersQuestionsHandler({ filters: { user: { $ne: user.id } }, project: { name: 1 } })).data;
		},
		async getAllOthersQuestionsCount(parent, args, { user, Question }) {
			if (!user) throw new Error('Not authorized to access this route');
			return (await getOthersQuestionsHandler({ filters: { user: { $ne: user.id } } })).total;
		},

		// ? All Self
		async getAllSelfQuestions(parent, args, { user, Question }, info) {
			if (!user) throw new Error('Not authorized to access this route');
			return await Question.find({ user: user.id });
		},
		async getAllSelfQuestionsName(parent, args, { user, Question }) {
			if (!user) throw new Error('Not authorized to access this route');
			return await Question.find({ user: user.id }).select('name');
		},
		async getAllSelfQuestionsCount(parent, args, { user, Question }) {
			if (!user) throw new Error('Not authorized to access this route');
			return await Question.countDocuments({ user: user.id });
		},

		// ? Paginated Mixed
		async getPaginatedMixedQuestions(parent, { pagination }, { Question }) {
			const { page, limit, sort, filter } = parsePagination(pagination);
			return (await getOthersQuestionsHandler({ filters: filter, sort, page, limit })).data;
		},

		async getPaginatedMixedQuestionsName(parent, { pagination }, { user, Question }) {
			const { page, limit, sort, filter } = parsePagination(pagination);
			return (await getOthersQuestionsHandler({ filters: filter, sort, page, limit, project: { name: 1 } })).data;
		},

		async getFilteredMixedQuestionsCount(parent, { filter = '{}' }, { Question }) {
			return (await getOthersQuestionsHandler({ filters: JSON.parse(filter) })).total;
		},

		// ? Paginated Others
		async getPaginatedOthersQuestions(parent, { pagination }, { user, Question }) {
			if (!user) throw new Error('Not authorized to access this route');
			const { page, limit, sort, filter } = parsePagination(pagination);
			return (await getOthersQuestionsHandler({ filters: { ...filter, user: { $ne: user.id } }, sort, page, limit }))
				.data;
		},

		async getPaginatedOthersQuestionsName(parent, { pagination }, { user, Question }) {
			if (!user) throw new Error('Not authorized to access this route');
			const { page, limit, sort, filter } = parsePagination(pagination);
			return (await getOthersQuestionsHandler({
				filters: { ...filter, user: { $ne: user.id } },
				sort,
				page,
				limit,
				project: { name: 1 }
			})).data;
		},

		async getFilteredOthersQuestionsCount(parent, { filter = '{}' }, { user, Question }) {
			if (!user) throw new Error('Not authorized to access this route');
			return (await getOthersQuestionsHandler({ filters: { ...JSON.parse(filter), user: { $ne: user.id } } })).total;
		},

		// ? Paginated Self
		async getPaginatedSelfQuestions(parent, { pagination }, { user, Question }) {
			if (!user) throw new Error('Not authorized to access this route');
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await Question.find({ ...filter, user: user.id }).sort(sort).skip(page).limit(limit);
		},

		async getPaginatedSelfQuestionsName(parent, { pagination }, { user, Question }) {
			if (!user) throw new Error('Not authorized to access this route');
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await Question.find({ ...filter, user: user.id }).sort(sort).skip(page).limit(limit).select('name');
		},

		async getFilteredSelfQuestionsCount(parent, { filter = '{}' }, { user, Question }) {
			if (!user) throw new Error('Not authorized to access this route');
			const count = await Question.countDocuments({ ...JSON.parse(filter), user: user.id });
			return count;
		},

		// ? Id mixed
		async getMixedQuestionsById(parent, { id }, { Question }) {
			const question = await Question.find({ _id: id, public: true }).select('-public -favourite');
			if (!question) throw new Error('Resource with that Id doesnt exist');
			return question;
		},

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
			if (!user) throw new Error('Not authorized to access this route');
			const [ question ] = await Question.find({ _id: id, user: { $ne: user.id }, public: true }).select(
				'-public -favourite'
			)[0];
			if (!question) throw new Error('Resource with that Id doesnt exist');
			return question;
		},

		// ? Id Self
		async getSelfQuestionsById(parent, { id }, { user, Question }) {
			if (!user) throw new Error('Not authorized to access this route');
			const [ question ] = await Question.find({ _id: id, user: user.id });
			if (!question) throw new Error('Resource with that Id doesnt exist');
			return question;
		}
	},
	Mutation: {
		async createQuestion(parent, { data }, { user }) {
			if (!user) throw new Error('Not authorized to access this route');
			return await createQuestionHandler(data, user.id, (err) => {
				throw err;
			});
		},
		async updateQuestion(parent, { data }, { user, Question }) {
			if (!user) throw new Error('Not authorized to access this route');
			const [ updated_question ] = await updateResource(Question, [ data ], user.id, (err) => {
				throw err;
			});
			return updated_question;
		},

		async updateQuestions(parent, { data }, { user, Question }) {
			if (!user) throw new Error('Not authorized to access this route');
			return await updateResource(Question, data, user.id, (err) => {
				throw err;
			});
		},
		async deleteQuestion(parent, { id }, { user, Question }) {
			if (!user) throw new Error('Not authorized to access this route');
			const [ question ] = await deleteQuestionHandler([ id ], user.id, (err) => {
				throw err;
			});
			return question;
		},
		async deleteQuestions(parent, { ids }, { user, Question }) {
			if (!user) throw new Error('Not authorized to access this route');
			return await deleteQuestionHandler(ids, user.id, (err) => {
				throw err;
			});
		}
	}
};
