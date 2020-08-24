const fs = require('fs');
const path = require('path');

const watchAction = require('../utils/resource/watchAction');
const addRatings = require('../utils/resource/addRatings');

async function deleteQuiz (ids, userId, Quiz, Question) {
	const deleted_quizzes = [];
	for (let i = 0; i < ids.length; i++) {
		const quizId = ids[i];
		const quiz = await Quiz.findById(quizId);
		if (!quiz) throw new Error(`Quiz not found with id of ${quizId}`);
		if (quiz.user.toString() !== userId.toString()) throw new Error(`User not authorized to delete quiz`);
		if (quiz.image && !quiz.image.match(/^(http|data:)/) && quiz.image !== 'none.png') {
			const location = path.join(path.dirname(__dirname), `${process.env.FILE_UPLOAD_PATH}/${quiz.image}`);
			if (fs.existsSync(location)) fs.unlinkSync(location);
		}
		const { questions } = quiz;
		for (let i = 0; i < questions.length; i++) {
			const questionId = questions[i];
			const question = await Question.findById(questionId);
			await question.remove();
		}
		await quiz.remove();
		deleted_quizzes.push(quiz);
	}
	return deleted_quizzes;
}

const QuizResolvers = {
	QuizQuestionStats: {
		async questions (parent, args, { Question, user }) {
			return await Question.find({ user: user.id }).select('difficulty type');
		}
	},
	QuestionStats: {
		difficulty: (parent) => parent.difficulty,
		type: (parent) => parent.type
	},
	QuizNameAndQuestions: {
		async questions (parent, args, { Question, user }) {
			return await Question.find({ user: user.id, quiz: parent.id });
		}
	},
	Query: {
		async getAllSelfQuizzesQuestionsStats (parent, args, { user, Quiz }) {
			return await Quiz.find({ user: user.id })
				.populate({
					path: 'questions',
					select: 'difficulty time_allocated name type'
				})
				.select('name questions');
		},
		async getAllSelfQuizzesForPlaypage (_, __, { user, Quiz }) {
			const quizzes = await Quiz.find({ user: user.id })
				.populate({
					path: 'questions',
					select: 'difficulty time_allocated name type'
				})
				.select('name questions');
			return quizzes;
		}
	},
	Mutation: {
		async updateQuizPlayedTimes (parent, { ids }, { user, Quiz }) {
			let total_updated = 0;
			if (ids) {
				for (let i = 0; i < ids.length; i++) {
					const quizId = ids[i];
					const quiz = await Quiz.findById(quizId);
					if (quiz.user.toString() !== user.id.toString()) {
						quiz.total_played++;
						total_updated++;
					}
					await quiz.save();
				}
			}
			return total_updated;
		},
		async updateQuizzesRatings (parent, { data }, ctx) {
			return await addRatings(ctx.quiz, data, ctx.user.id);
		},
		async updateQuizzesWatch (parent, { ids }, { User, user }) {
			return await watchAction('quizzes', { quizzes: ids }, await User.findById(user.id));
		},
		async deleteQuiz (_, { id }, { user, Quiz, Question }) {
			await deleteQuiz([ id ], user.id, Quiz, Question);
		},
		async deleteQuizzes (_, { id }, { user, Quiz, Question }) {
			await deleteQuiz([ id ], user.id, Quiz, Question);
		}
	}
};

module.exports = QuizResolvers;
