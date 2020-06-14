const casual = require('casual');
const faker = require('faker');
const axios = require('axios');
const randomColor = require('randomcolor');

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

casual.define('quiz', function() {
	const len = getRandomInt(0, 5);
	const width = 100 * getRandomInt(3, 6);
	const height = Math.floor(width / 1.66);
	return {
		image: `https://picsum.photos/id/${getRandomInt(0, 1000)}/${width}/${height}.jpg`,
		name: casual.title,
		subject: casual.word,
		tags: len === 0 ? [] : casual.array_of_words(len).map((word) => `${word}:${randomColor()}`),
		source: faker.internet.url(),
		favourite: casual.boolean,
		public: casual.boolean
	};
});

const createQuiz = async ({ quizzes, total_users, users }) => {
	const quiz = casual.quiz;
	try {
		const user = users[getRandomInt(0, total_users - 1)];
		const { data: { data: { _id } } } = await axios.post(
			`http://localhost:5001/api/v1/quizzes`,
			{ ...quiz },
			{
				headers: {
					Authorization: `Bearer ${user.token}`
				}
			}
		);
		user.quizzes.push(_id);
		quizzes.push({ _id, questions: [] });
	} catch (err) {
		console.log(err.message);
	}
};

async function createQuizzes({ count, quizzes, total_users, users }) {
	let created = 1;
	return new Promise((resolve, reject) => {
		const quizInterval = setInterval(async () => {
			if (created <= count) {
				await createQuiz({ quizzes, total_users, users });
				console.log(`Created Quiz ${created}`);
				created++;
			} else {
				clearInterval(quizInterval);
				resolve('Quizzes created');
			}
		}, 500);
	});
}

module.exports = {
	createQuizzes
};
