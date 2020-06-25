module.exports = {
	Mutation: {
		async createReport(parent, { data }, { user, Report }) {
			data.user = user.id;
			return await new Report(data);
		}
	},
	Report: {
		async user(parent, args, { user, User }) {
			return await User.findById(user.id);
		},
		async quizzes(parent, args, { Quiz }) {
			const quizzes = [];
			for (let i = 0; i < parent.quizzes; i++) {
				const quizId = quizzes[i];
				const quiz = await Quiz.findById(quizId);
				quizzes.push(quiz);
			}
			return quizzes;
		},
		disabled(parent) {
			return parent.disabled;
		},
		questions(parent) {
			return parent.questions;
		}
	},
	ReportQuestion: {
		async question(parent, args, { Question }) {
			return await Question.findById(parent.question);
		}
	}
};
