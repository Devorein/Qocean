const {
	createQuiz,
	updateQuiz,
	deleteQuiz,
	deleteQuizzes,
	quizPhotoUpload,
	updatePlayedTimes,
	updateQuizRatings,
	watchQuizzes,
	updateQuizzes,
	getAllTags,
	playPageQuiz
} = require('../controllers/quizzes');

module.exports = {
	Query: {
		// async getOtherQuizzes(parent, args, { Quiz }, info) {
		// 	return await Quiz.find({});
		// }
	}
};
