const path = require('path');
const fs = require('fs');

async function validateQuestionHandler (ids, QuestionModel) {
	const responses = { correct: [], incorrect: [] };
	for (let i = 0; i < ids.length; i++) {
		const { id, answers } = ids[i];
		const question = await QuestionModel.findById(id).select('+answers');
		if (!answers) throw new Error(`Provide the answers`);
		if (question) {
			let [ isCorrect ] = await question.validateAnswer(answers);
			if (isCorrect) responses.correct.push(id);
			else responses.incorrect.push(id);
		} else throw new Error(`Question doesn't exist`);
	}
	return responses;
}

async function sendAnswerHandler (ids, QuestionModel) {
	const all_answers = [];
	for (let i = 0; i < ids.length; i++) {
		const id = ids[i];
		const { answers } = await QuestionModel.findOne({ _id: id }).select('+answers');
		if (!answers) throw new Error(`Question doesnt exist`);
		all_answers.push({ id, answers });
	}
	return all_answers;
}

module.exports = {
	Query: {
		async getMixedQuestionsByIdAnswers (parent, { id }, { Question }) {
			const { answers } = await Question.findOne({ _id: id }).select('+answers');
			if (!answers) throw new Error(`Question doesnt exist`);
			return answers;
		},
		async sendAnswer (_, { id }, { QuestionModel }) {
			return await sendAnswerHandler([ id ], QuestionModel);
		},
		async sendAnswers (_, { ids }, { QuestionModel }) {
			return await sendAnswerHandler(ids, QuestionModel);
		},
		async getOthersQuestions (_, { filters = {}, sort, limit, page }, { Question }) {
			const additional = [];
			if (!sort) {
				sort = {};
				sort.created_at = -1;
				sort.name = -1;
			}
			const project = { public: 0, favourite: 0, answers: 0 };
			if (page !== undefined && limit !== null) additional.push({ $skip: page });
			if (limit !== undefined && limit !== null) additional.push({ $limit: limit });
			const pipeline = [
				{
					$match: {
						...filters,
						public: true
					}
				},
				{ $project: project },
				{
					$lookup: {
						from: 'quizzes',
						let: { quizId: '$quiz' },
						pipeline: [
							{
								$match: {
									$expr: {
										$and: [ { $eq: [ '$_id', '$$quizId' ] }, { $eq: [ '$public', true ] } ]
									}
								}
							},
							{
								$project: {
									name: 1
								}
							}
						],
						as: 'quiz'
					}
				},
				{ $set: { id: '$_id' } },
				{ $unwind: '$quiz' },
				{
					$sort: sort
				},
				...additional
			];

			const questions = await Question.aggregate(pipeline);
			const total = questions.length;
			return total;
		},
		async getMixedQuestionsByIdsAnswers (parent, { ids }, { Question }) {
			const all_answers = [];
			for (let i = 0; i < ids.length; i++) {
				const id = ids[i];
				const { answers } = await Question.findOne({ _id: id }).select('+answers');
				if (!answers) throw new Error(`Question doesnt exist`);
				all_answers.push({ id, answers });
			}
			return all_answers;
		},

		async getMixedQuestionsByIdValidation (parent, { id }) {
			return await validateQuestionHandler([ id ]);
		},

		async getMixedQuestionsByIdsValidation (parent, { ids }) {
			return await validateQuestionHandler(ids);
		}
	},
	Mutation: {
		async createQuestion (_, { data }, { user, Quiz, Question }) {
			if (!data.quiz) throw new Error(`Provide the quiz id`);
			const quiz = await Quiz.findById(data.quiz);
			if (!quiz) throw new Error(`No quiz with the id ${data.quiz} found`);
			if (quiz.user.toString() !== user.id.toString())
				throw new Error(`User not authorized to add a question to this quiz`);
			const [ isValidQuestion, message ] = await Question.validateQuestion(data);
			if (isValidQuestion) {
				data.user = user.id;
				const question = await Question.create(data);
				return question;
			} else throw new Error(message);
		},
		async deleteQuestions (_, { ids }, { Question, user }) {
			const deleted_questions = [];
			for (let i = 0; i < ids.length; i++) {
				const questionId = ids[i];
				const question = await Question.findById(questionId);
				if (!question) throw new Error(`Question not found with id of ${questionId}`);
				if (question.user.toString() !== user.id.toString()) return new Error(`User not authorized to delete question`);
				if (question.image && !question.image.match(/^(http|data:)/) && question.image !== 'none.png') {
					const location = path.join(path.dirname(__dirname), `${process.env.FILE_UPLOAD_PATH}/${question.image}`);
					if (fs.existsSync(location)) fs.unlinkSync(location);
				}
				await question.remove();
				deleted_questions.push(question);
			}
			return deleted_questions;
		}
	}
};
