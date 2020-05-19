const axios = require('axios');
const casual = require('casual');
const faker = require('faker');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env' });

const Quiz = require('./models/Quiz');
const Question = require('./models/Question');
const User = require('./models/User');
const Environment = require('./models/Environment');
const Folder = require('./models/Folder');

// Connect to db
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
	useUnifiedTopology: true
});

casual.define('user', function() {
	return {
		email: faker.internet.email(),
		name: casual.first_name + ' ' + casual.last_name,
		password: casual.password,
		username: casual.password.toLowerCase(),
		image: faker.image.imageUrl()
	};
});

casual.define('quiz', function() {
	return {
		name: casual.title,
		subject: casual.word,
		tags: casual.array_of_words(casual.integer(0, 3)),
		source: faker.internet.url()
	};
});

const users = [];
const quizzes = [];
const total_users = casual.integer(5, 10);
const total_quizzes = casual.integer(15, 25);
const total_folders = casual.integer(15, 30);
const total_envs = casual.integer(10, 15);
const total_questions = casual.integer(40, 50);

const createUser = async () => {
	const user = casual.user;
	try {
		const { data: { token } } = await axios.post(`http://localhost:5001/api/v1/auth/register`, { ...user });
		users.push({
			token,
			quizzes: [],
			questions: [],
			folders: [],
			envs: []
		});
	} catch (err) {
		console.log(err.message);
	}
};

const createQuiz = async () => {
	const quiz = casual.quiz;
	try {
		const user = casual.integer(0, total_users - 1);
		const { data: { data: { _id } } } = await axios.post(
			`http://localhost:5001/api/v1/quizzes`,
			{ ...quiz },
			{
				headers: {
					Authorization: `Bearer ${users[user].token}`
				}
			}
		);
		users[user].quizzes.push(_id);
		quizzes.push(_id);
	} catch (err) {
		console.log(err.message);
	}
};

(async function() {
	await Quiz.deleteMany();
	await Question.deleteMany();
	await User.deleteMany();
	await Environment.deleteMany();
	await Folder.deleteMany();
	console.log(`User destroyed ...`.red.inverse);
	console.log(`Quizzes destroyed ...`.red.inverse);
	console.log(`Questions destroyed ...`.red.inverse);
	console.log(`Environments destroyed ...`.red.inverse);
	console.log(`Folders destroyed ...`.red.inverse);

	const userInterval = setInterval(async () => {
		if (users.length < total_users) await createUser();
		else {
			clearInterval(userInterval);
			const quizInterval = setInterval(async () => {
				console.log(quizzes.length);
				if (quizzes.length < total_quizzes) await createQuiz();
				else {
					clearInterval(quizInterval);
				}
			}, 1000);
		}
	}, 1000);
})();
