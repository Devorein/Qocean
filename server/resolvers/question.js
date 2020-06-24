const parsePagination = require('../utils/parsePagination');
const updateResource = require('../utils/updateResource');

const {
	createQuestionHandler,
	deleteQuestionHandler,
	validateQuestion,
	validateQuestions,
	sendAnswer,
	sendAnswers,
	questionPhotoUpload,
	getOthersQuestions
} = require('../controllers/questions');

module.exports = {
	Query: {
		// ? All mixed
		async getAllMixedQuestions(parent, args, { Question }, info) {
			return await Question.find({}).select('-public -favourite');
		},
		async getAllMixedQuestionsName(parent, args, { Question }) {
			return await Question.find({}).select('name');
		},

		async getAllMixedQuestionsCount(parent, args, { Question }) {
			return await Question.countDocuments({});
		},

		// ? All Others
		async getAllOthersQuestions(parent, args, { user, Question }, info) {
			if (!user) throw new Error('Not authorized to access this route').select('-public -favourite');
			return await Question.find({ user: { $ne: user.id } });
		},
		async getAllOthersQuestionsName(parent, args, { user, Question }) {
			if (!user) throw new Error('Not authorized to access this route');
			return await Question.find({ user: { $ne: user.id } }).select('name');
		},
		async getAllOthersQuestionsCount(parent, args, { user, Question }) {
			if (!user) throw new Error('Not authorized to access this route');
			return await Question.countDocuments({ user: { $ne: user.id } });
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
			return await Question.find(filter).sort(sort).skip(page).limit(limit).select('-public -favourite');
		},

		async getPaginatedMixedQuestionsName(parent, { pagination }, { user, Question }) {
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await Question.find(filter).sort(sort).skip(page).limit(limit).select('name');
		},

		async getFilteredMixedQuestionsCount(parent, { filter = '{}' }, { Question }) {
			return await Question.countDocuments(JSON.parse(filter));
		},

		// ? Paginated Others
		async getPaginatedOthersQuestions(parent, { pagination }, { user, Question }) {
			if (!user) throw new Error('Not authorized to access this route');
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await Question.find({ ...filter, user: { $ne: user.id } })
				.sort(sort)
				.skip(page)
				.limit(limit)
				.select('-public -favourite');
		},

		async getPaginatedOthersQuestionsName(parent, { pagination }, { user, Question }) {
			if (!user) throw new Error('Not authorized to access this route');
			const { page, limit, sort, filter } = parsePagination(pagination);
			return await Question.find({ ...filter, user: { $ne: user.id } })
				.sort(sort)
				.skip(page)
				.limit(limit)
				.select('name');
		},

		async getFilteredOthersQuestionsCount(parent, { filter = '{}' }, { user, Question }) {
			if (!user) throw new Error('Not authorized to access this route');
			const count = await Question.countDocuments({ ...JSON.parse(filter), user: { $ne: user.id } });
			return count;
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
			const question = await Question.findById(id).select('-public -favourite');
			if (!question) throw new Error('Resource with that Id doesnt exist');
			return question;
		},

		// ? Id Others
		async getOthersQuestionsById(parent, { id }, { user, Question }) {
			if (!user) throw new Error('Not authorized to access this route');
			const [ question ] = await Question.find({ _id: id, user: { $ne: user.id } }).select('-public -favourite')[0];
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
