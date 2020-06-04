const mongoose = require('mongoose');
const extendSchema = require('../utils/extendSchema');
const ResourceSchema = require('./Resource');

const QuestionSchema = extendSchema(ResourceSchema, {
	name: {
		type: String,
		maxlength: [ 1000, 'Question cant be more than 1000 characters' ],
		minlength: [ 3, 'Question cant be less than 3 characters' ],
		required: [ true, 'Please provide the question' ],
		trim: true
	},
	type: {
		type: String,
		enum: [ 'FIB', 'Snippet', 'MCQ', 'MS', 'FC', 'TF' ],
		required: [ true, 'Please provide the question type' ]
	},
	format: {
		type: String,
		enum: [ 'md', 'regular' ],
		default: 'regular'
	},
	weight: {
		type: Number,
		default: 1,
		min: [ 1, 'Weight cannot be less than 1' ],
		max: [ 10, 'Weight cannot be more than 10' ]
	},
	quiz: {
		type: mongoose.Schema.ObjectId,
		ref: 'Quiz',
		required: [ true, 'Please provide the quiz id' ]
	},
	add_to_score: {
		type: Boolean,
		default: true
	},
	time_allocated: {
		type: Number,
		default: 30,
		min: [ 15, 'Time allocated cant be less than 15 seconds' ],
		max: [ 120, 'Time allocated cant be more than 120 seconds' ]
	},
	difficulty: {
		type: String,
		enum: [ 'Beginner', 'Intermediate', 'Advanced' ],
		default: 'Beginner'
	},
	image: {
		type: String,
		default: 'none.png'
	},
	answers: {
		type: [ [ String ] ],
		required: [ true, 'Please provide answers' ],
		select: false
	},
	options: {
		type: [ String ],
		required: true
	}
});

QuestionSchema.statics.getAverageTimeAllocated = async function(quizId) {
	const obj = await this.aggregate([
		{
			$match: { quiz: quizId }
		},
		{
			$group: {
				_id: '$quiz',
				averageTimeAllocated: { $avg: '$time_allocated' }
			}
		}
	]);
	try {
		await this.model('Quiz').findByIdAndUpdate(quizId, {
			average_quiz_time: obj[0].averageTimeAllocated
		});
	} catch (err) {
		console.log(err);
	}
};

QuestionSchema.statics.getAverageDifficulty = async function(quizId) {
	const obj = await this.aggregate([
		{
			$match: { quiz: quizId }
		},
		{
			$project: {
				difficulty: {
					$cond: {
						if: { $eq: [ '$difficulty', 'Beginner' ] },
						then: 3.33,
						else: {
							$cond: { if: { $eq: [ '$difficulty', 'Intermediate' ] }, then: 6.66, else: 10 }
						}
					}
				}
			}
		},
		{
			$group: {
				_id: '$quiz',
				averageDifficulty: { $avg: '$difficulty' }
			}
		}
	]);
	try {
		const parsed = parseFloat(obj[0].average_difficulty);
		await this.model('Quiz').findByIdAndUpdate(quizId, {
			average_difficulty: parsed <= 3.34 ? 'Beginner' : parsed <= 6.67 ? 'Intermediate' : 'Advanced'
		});
	} catch (err) {
		console.log(err);
	}
};

QuestionSchema.statics.validateQuestion = async function(question) {
	const { type } = question;
	question.options = question.options ? question.options : [];
	if (!question.answers) return [ false, 'Provide the answers for the question' ];
	if (!Array.isArray(question.answers)) return [ false, 'Answers must be an array' ];
	if (question.answers.length <= 0) return [ false, 'Provide atleast one answer for the question' ];
	if (type === 'MCQ' || type === 'MS' || type === 'TF') {
		if (type === 'MCQ' || type === 'MS') {
			if (!question.options) return [ false, 'Provide the options for the question' ];
			if (question.options.length < 3) return [ false, 'Provide atleast 3 options for the question' ];
			if (question.options.length > 6) return [ false, 'Options for the question cant be more than 6' ];
			if (!Array.isArray(question.options)) return [ false, 'Options must be an array' ];
			const containsDuplicate =
				new Set(question.options.map((option) => option.toString().trim())).size !== question.options.length;
			if (containsDuplicate) return [ false, 'There is duplicate options for the question' ];
			if (question.answers.length > question.options.length) return [ false, 'You provided more answer than options' ];
			const containsDuplicateAnswer =
				new Set(question.answers.map((answer) => answer.toString().trim())).size !== question.answers.length;
			if (containsDuplicateAnswer) return [ false, 'There is duplicate answer for the question' ];
			const isValidAnswer = question.answers.every((answer) => parseInt(answer) >= 0 && parseInt(answer) <= 5);
			if (!isValidAnswer) return [ false, 'Your answer is out of range' ];
			if (type === 'MCQ') if (question.answers.length > 1) return [ false, 'You provided   more answers than needed' ];
		} else if (type === 'TF') {
			if (question.options.length >= 1) return [ false, 'No need to provide the options' ];
			if (question.answers.length > 1) return [ false, 'You provided more answers than needed' ];
			const isValidAnswer = question.answers.every((answer) => parseInt(answer) >= 0 && parseInt(answer) <= 1);
			if (!isValidAnswer) return [ false, 'Your answer is out of range' ];
		}
	} else if (type === 'FC' || type === 'Snippet') {
		if (question.options.length >= 1) return [ false, 'No need to provide the options' ];
		if (question.answers.length >= 2) return [ false, 'You provided too many answers' ];
		if (question.answers[0].length <= 0) return [ false, 'Provide atleast one answer for the question' ];
		if (question.answers[0].length > 3) return [ false, 'You provided too many answers' ];
	} else if (type === 'FIB') {
		if (question.options.length >= 1) return [ false, 'No need to provide the options' ];
		if (question.answers.length <= 0 || question.answers[0].length <= 0)
			return [ false, 'Provide atleast one answer for the question' ];
		const isAnyEmpty = question.answers.some((answer) => answer.length === 0);
		if (isAnyEmpty) return [ false, 'Your cant have any empty answers' ];
		const isAnyOverflow = question.answers.some((answer) => answer.length > 3);
		if (isAnyOverflow) return [ false, 'You provided too many alternatives' ];
		const count = (question.name.match(/\$\{\_\}/g) || []).length;
		if (count !== question.answers.length) return [ false, 'You provided incorrect number of answers' ];
	}
	return [ true ];
};

function typedChecker(correct_answers, user_answer) {
	let original_answer = user_answer;
	return correct_answers.some((correct_answer) => {
		const hasMod = correct_answer.match(/^\[(\w{1,3}[,|\]])+/);
		if (hasMod) {
			correct_answer = correct_answer.substr(hasMod[0].length + 1);
			const mods = hasMod[0].replace(/\[|\]/g, '').split(',');
			if (mods.includes('IC')) {
				correct_answer = correct_answer.toLowerCase();
				user_answer = user_answer.toLowerCase();
			}
			if (mods.includes('IS')) {
				correct_answer = correct_answer.replace(/\s/g, '');
				user_answer = user_answer.replace(/\s/g, '');
			}
		} else user_answer = original_answer;
		return correct_answer === user_answer;
	});
}

QuestionSchema.methods.validateAnswer = async function(answers) {
	const { type } = this;
	let isCorrect = false,
		message = 'Wrong answer';
	if (type === 'MCQ' || type === 'TF') {
		isCorrect = answers.length === this.answers.length;
		isCorrect = isCorrect && parseInt(answers[0]) === parseInt(this.answers[0][0]);
	} else if (type === 'MS') {
		const transformed = answers.map((answer) => parseInt(answer));
		const checkAgainst = this.answers.map((answer) => parseInt(answer));
		isCorrect = answers.length === checkAgainst.length;
		isCorrect = isCorrect && !transformed.some((answer) => checkAgainst.indexOf(answer) === -1);
	} else if (type === 'Snippet') isCorrect = answers.length === 1 && typedChecker(this.answers[0], answers);
	else if (type === 'FIB') {
		isCorrect = answers.length === this.answers.length;
		isCorrect = isCorrect && answers.every((answer, index) => typedChecker(this.answers[index], answer));
	} else if (type === 'FC') {
		isCorrect = answers.length !== 0 && answers.length <= this.answers[0].length;
		answers = answers.map((answer) => parseInt(answer));
		isCorrect = isCorrect && answers.every((answer) => answer >= 0 && answer <= 2);
	}
	if (isCorrect) message = 'Correct answer';
	return [ isCorrect, message ];
};

QuestionSchema.post('save', async function() {
	console.log(this);
	await this.model('User').add(this.user, 'questions', this._id);
	await this.model('Quiz').add(this.quiz, 'questions', this._id);
	const folders = await this.model('Folder').find({ quizzes: this.quiz });
	for (let i = 0; i < folders.length; i++) {
		const folder = folders[i];
		folder.total_questions++;
		await folder.save();
	}
	this.constructor.getAverageTimeAllocated(this.quiz);
	this.constructor.getAverageDifficulty(this.quiz);
});

QuestionSchema.pre('remove', async function() {
	const question = await this.model('Question').findById(this._id);
	await this.model('User').remove(question.user, 'questions', question._id);
	await this.model('Quiz').remove(question.quiz, 'questions', question._id);
	const folders = await this.model('Folder').find({ quizzes: question.quiz });
	for (let i = 0; i < folders.length; i++) {
		const folder = folders[i];
		folder.total_questions--;
		await folder.save();
	}
	this.constructor.getAverageTimeAllocated(question.quiz);
	this.constructor.getAverageDifficulty(question.quiz);
});

module.exports = mongoose.model('Question', QuestionSchema);
