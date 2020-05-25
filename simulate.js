const axios = require('axios');
const casual = require('casual');
const faker = require('faker');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');
const fs = require('fs');
const randomColor = require('randomcolor');

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

const icons = [ 'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Indigo', 'Purple' ];

casual.define('user', function() {
	return {
		email: faker.internet.email(),
		name: casual.first_name + ' ' + casual.last_name,
		password: casual.password,
		username: casual.password.toLowerCase(),
		image: faker.image.imageUrl(),
		version: [ 'Rower', 'Sailor', 'Captain' ][casual.integer(0, 2)]
	};
});

casual.define('quiz', function() {
	return {
		name: casual.title,
		subject: casual.word,
		tags: `${casual.array_of_words(casual.integer(0, 3))}:${randomColor()}`,
		source: faker.internet.url(),
		favourite: casual.boolean,
		public: casual.boolean
	};
});

casual.define('folder', function() {
	let name = casual.array_of_words(2).join('');
	while (name.length > 20) name = casual.array_of_words(2).join('');
	return {
		name,
		icon: `${icons[casual.integer(0, icons.length - 1)]}_folder.svg`,
		favourite: casual.boolean,
		public: casual.boolean
	};
});

casual.define('question', function() {
	const types = [ 'MCQ', 'MS', 'TF', 'Snippet', /* 'FIB', */ 'FC' ];
	const type = types[casual.integer(0, types.length - 1)];
	const times = [ 15, 30, 45, 60, 75, 90, 105, 120 ];
	const time = times[casual.integer(0, times.length - 1)];
	let options,
		answers = [];

	if (type === 'MCQ') {
		const total_options = casual.integer(3, 6);
		options = Array(total_options).fill(0).map((_) => casual.sentence);
		const total_answers = casual.integer(1, total_options - 1);

		while (answers.length <= total_answers) {
			const r = casual.integer(1, total_options - 1);
			if (answers.indexOf(r) === -1) answers.push(r);
		}
	} else if (type === 'MS') {
		const total_options = casual.integer(3, 6);
		options = Array(total_options).fill(0).map((_) => casual.sentence);
		answers.push(casual.integer(1, total_options - 1));
	} else if (type === 'TF') {
		options = [];
		answers.push([ 0, 1 ][casual.integer(0, 1)]);
	} else if (type === 'FC') {
		options = [];
		answers = [ Array(casual.integer(1, 3)).map((_) => casual.sentence) ];
	} else if (type === 'FIB') {
		options = [];
		answers = [ casual.sentence ];
	} else if (type === 'Snippet') {
		options = [];
		answers = [ casual.array_of_words(casual.integer(1, 3)) ];
	}

	return {
		question: casual.sentence,
		type,
		weight: casual.integer(1, 10),
		add_to_score: casual.boolean,
		time_allocated: time,
		difficulty: [ 'Beginner', 'Intermediate', 'Advanced' ][casual.integer(0, 2)],
		image: faker.internet.url(),
		options,
		answers,
		favourite: casual.boolean,
		public: casual.boolean
	};
});

casual.define('environment', function() {
	const times = [ 15, 30, 45, 60, 75, 90, 105, 120 ];
	const time = times[casual.integer(0, times.length - 1)];
	const notification_timings = [ 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000 ];
	const notification_timing = notification_timings[casual.integer(0, notification_timings.length - 1)];
	const resources = [ 'User', 'Question', 'Quiz', 'Folder', 'Environment' ];
	const rpp = [ 10, 15, 20, 25, 30, 40, 50 ];
	return {
		name: casual.array_of_words(2).join(''),
		icon: `${icons[casual.integer(0, icons.length - 1)]}_env.svg`,
		favourite: casual.boolean,
		public: casual.boolean,
		theme: [ 'Light', 'Dark', 'Navy' ][casual.integer(0, 2)],
		animation: casual.boolean,
		sound: casual.boolean,
		default_question_timing: time,
		default_question_type: [ 'FIB', 'Snippet', 'MCQ', 'MS', 'FC', 'TF' ][casual.integer(0, 5)],
		default_question_difficulty: [ 'Beginner', 'Intermediate', 'Advanced' ][casual.integer(0, 2)],
		default_question_weight: casual.integer(1, 10),
		reset_on_success: casual.boolean,
		reset_on_error: casual.boolean,
		default_explore_landing: resources[casual.integer(0, resources.length - 1)],
		default_create_landing: resources.splice(1)[casual.integer(0, resources.length - 2)],
		default_self_landing: resources.splice(1)[casual.integer(0, resources.length - 2)],
		default_explore_rpp: rpp[casual.integer(0, rpp.length - 1)],
		default_self_rpp: rpp[casual.integer(0, rpp.length - 1)],
		notification_timing
	};
});

const users = [],
	quizzes = [],
	questions = [],
	folders = [],
	envs = [];

const total_users = casual.integer(10, 25),
	total_quizzes = casual.integer(30, 50),
	total_questions = casual.integer(50, 75),
	total_folders = casual.integer(10, 25),
	total_envs = casual.integer(35, 50);

const loginData = [];

const createUser = async () => {
	const user = casual.user;
	try {
		const { data: { token, _id } } = await axios.post(`http://localhost:5001/api/v1/auth/register`, { ...user });
		users.push({
			_id,
			token,
			quizzes: [],
			questions: [],
			folders: [],
			envs: []
		});
		console.log(`Created User ${users.length}`);
		loginData.push({
			password: user.password,
			email: user.email,
			username: user.username
		});
	} catch (err) {
		console.log(err.message);
	}
};

const createQuiz = async () => {
	const quiz = casual.quiz;
	try {
		const user = users[casual.integer(0, total_users - 1)];
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
		console.log(`Created Quiz ${quizzes.length}`);
	} catch (err) {
		console.log(err.message);
	}
};

const createFolder = async () => {
	const folder = casual.folder;
	try {
		const user = users[casual.integer(0, total_users - 1)];
		const quiz = user.quizzes[casual.integer(0, user.quizzes.length - 1)];
		folder.quizzes = quiz;
		const { data: { data: { _id } } } = await axios.post(
			`http://localhost:5001/api/v1/folders`,
			{ ...folder },
			{
				headers: {
					Authorization: `Bearer ${user.token}`
				}
			}
		);
		user.folders.push(_id);
		folders.push(_id);
		console.log(`Created Folder ${folders.length}`);
	} catch (err) {
		console.log(err.message);
	}
};

const createQuestion = async () => {
	const question = casual.question;
	let user = users[casual.integer(0, total_users - 1)];
	while (user.quizzes.length === 0) user = users[casual.integer(0, total_users - 1)];
	const quizId = user.quizzes[casual.integer(0, user.quizzes.length - 1)];
	// const quiz = quizzes.find(({ _id }) => quizId === _id);
	// console.log(quiz);
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
		// quiz.questions.push(_id);
		questions.push(_id);
		console.log(`Created Question ${questions.length}`);
	} catch (err) {
		console.log(err.message);
	}
};

const createEnvironment = async () => {
	const environment = casual.environment;
	try {
		const user = users[casual.integer(0, total_users - 1)];
		environment.user = user._id;
		const { data: { data: { _id } } } = await axios.post(
			`http://localhost:5001/api/v1/environments`,
			{ ...environment },
			{
				headers: {
					Authorization: `Bearer ${user.token}`
				}
			}
		);
		user.envs.push(_id);
		envs.push(_id);
		console.log(`Created Environment ${envs.length}`);
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
			const data = loginData.map(({ password, username, email }) => `${username} ${email} ${password}`).join('\n');
			fs.writeFileSync(`${__dirname}/store/loginData.txt`, data, 'UTF-8');
			const quizInterval = setInterval(async () => {
				if (quizzes.length < total_quizzes) await createQuiz();
				else {
					clearInterval(quizInterval);
					const environmentInterval = setInterval(async () => {
						if (envs.length < total_envs) await createEnvironment();
						else {
							clearInterval(environmentInterval);
							const folderInterval = setInterval(async () => {
								if (folders.length < total_folders) await createFolder();
								else {
									clearInterval(folderInterval);
									const questionInterval = setInterval(async () => {
										if (questions.length < total_questions) await createQuestion();
										else {
											clearInterval(questionInterval);
											process.exit();
										}
									}, 500);
								}
							}, 500);
						}
					}, 500);
				}
			}, 500);
		}
	}, 500);
})();
