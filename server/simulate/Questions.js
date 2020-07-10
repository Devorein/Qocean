const casual = require('casual');
const axios = require('axios');

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

casual.define('question', function() {
	const types = [ 'MCQ', 'MS', 'TF', 'Snippet', 'FIB', 'FC' ];
	const type = types[getRandomInt(0, types.length - 1)];
	const times = [ 15, 30, 45, 60, 75, 90, 105, 120 ];
	const time = times[getRandomInt(0, times.length - 1)];
	let options,
		answers = [],
		name = casual.sentence;

	if (type === 'MCQ') {
		const total_options = getRandomInt(3, 6);
		options = Array(total_options).fill(0).map(() => casual.sentence);
		answers.push(getRandomInt(1, total_options - 1));
	} else if (type === 'MS') {
		const total_options = getRandomInt(3, 6);
		options = Array(total_options).fill(0).map(() => casual.sentence);
		const total_answers = getRandomInt(1, total_options - 1);

		while (answers.length < total_answers) {
			const r = getRandomInt(1, total_options - 1);
			if (answers.indexOf(r) === -1) answers.push(r);
		}
	} else if (type === 'TF') {
		options = [];
		answers.push([ 0, 1 ][getRandomInt(0, 1)]);
	} else if (type === 'FC') {
		options = [];
		answers = [ Array(getRandomInt(1, 3)).fill(0).map(() => casual.sentence) ];
	} else if (type === 'FIB') {
		options = [];
		const blanks = getRandomInt(1, 6);
		name = name.split(' ').concat(casual.sentence.split(' '));
		for (let i = 1; i <= blanks; i++) {
			answers[i - 1] = [];
			let pos = getRandomInt(0, name.length - 1);
			while (name[pos] === '${_}') pos = getRandomInt(0, name.length - 1);
			name[pos] = '${_}';
			const alternates = getRandomInt(1, 3);
			answers[i - 1].push(...casual.sentence.split(' ').slice(0, alternates));
		}
		name = name.join(' ');
	} else if (type === 'Snippet') {
		options = [];
		answers = [ casual.array_of_words(getRandomInt(1, 3)) ];
	}
	const width = 100 * getRandomInt(3, 6);
	const height = Math.floor(width / 1.66);
	return {
		name,
		type,
		weight: getRandomInt(1, 10),
		add_to_score: casual.boolean,
		time_allocated: time,
		difficulty: [ 'Beginner', 'Intermediate', 'Advanced' ][getRandomInt(0, 2)],
		image: `https://picsum.photos/id/${getRandomInt(0, 1000)}/${width}/${height}.jpg`,
		options,
		answers,
		favourite: casual.boolean,
		public: casual.boolean,
		format: [ 'md', 'regular' ][getRandomInt(0, 1)]
	};
});

const createQuestion = async ({ quizzes, questions, total_users, users }) => {
	const question = casual.question;
	let user = users[getRandomInt(0, total_users - 1)];
	while (user.quizzes.length === 0) user = users[getRandomInt(0, total_users - 1)];
	const quizId = user.quizzes[getRandomInt(0, user.quizzes.length - 1)];
	const quiz = quizzes.find(({ _id }) => quizId === _id);
	try {
		question.quiz = quizId;
		const { data: { data: { _id } } } = await axios.post(
			`http://localhost:5001/api/v1/questions`,
			{ ...question },
			{
				headers: {
					Authorization: `Bearer ${user.token}`
				}
			}
		);
		user.questions.push(_id);
		quiz.questions.push(_id);
		questions.push(_id);
	} catch (err) {
		console.log(err.message);
	}
};

async function createQuestions({ count, questions, quizzes, total_users, users }) {
	let created = 1;
	return new Promise((resolve) => {
		const questionInterval = setInterval(async () => {
			if (created <= count) {
				await createQuestion({ quizzes, questions, total_users, users });
				console.log(`Created Question ${created}`);
				created++;
			} else {
				clearInterval(questionInterval);
				resolve('Questions created');
			}
		}, 500);
	});
}

module.exports = {
	createQuestions
};
