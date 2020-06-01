const axios = require('axios');
const casual = require('casual');
const faker = require('faker');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');
const fs = require('fs');
const { createUsers } = require('./simulate/Users');
const { createQuizzes } = require('./simulate/Quizzes');
const { createQuestions } = require('./simulate/Questions');
const { createFolders } = require('./simulate/Folders');
const { createEnvironments } = require('./simulate/Environments');

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

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

(async function() {
	const args = process.argv.slice(2);
	const deletePrev = args.includes('-d');
	const userArg = args.indexOf('-u');
	const createMode = args[userArg + 1] && !args[userArg + 1].includes('-') ? 'specified' : 'all';

	if (deletePrev) {
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
	}

	if (createMode === 'specified') {
		const username = args[userArg + 1];
		const { email, password } = JSON.parse(fs.readFileSync(`${__dirname}/store/loginData.json`, 'UTF-8')).find(
			(user) => user.username === username
		);

		const { data: { token } } = await axios.post(`http://localhost:5001/api/v1/auth/login`, {
			email,
			password
		});

		const headers = {
			headers: {
				Authorization: `Bearer ${token}`
			}
		};

		const shouldCreateQuiz = args.includes('-qz');
		const shouldCreateQuestion = args.includes('-qs');
		const shouldCreateFolder = args.includes('-f');
		const shouldCreateEnv = args.includes('-e');
	} else if (createMode === 'all') {
		const users = [],
			quizzes = [],
			questions = [],
			folders = [],
			envs = [],
			loginData = [];

		let counts = [];

		const amounts = args[args.indexOf('-amnt') + 1];
		if (!amounts.startsWith('-')) {
			counts = amounts.split(',').map((count) => parseInt(count));
			counts = counts.concat(Array(5 - counts.length).fill(counts[counts.length - 1]));
		} else {
			counts = [
				getRandomInt(10, 25),
				getRandomInt(30, 50),
				getRandomInt(50, 75),
				getRandomInt(10, 25),
				getRandomInt(35, 50)
			];
		}
		const total_users = counts[0];
		await createUsers({
			count: total_users,
			users,
			loginData
		});

		await createQuizzes({
			count: counts[1],
			users,
			total_users,
			quizzes
		});

		await createQuestions({
			count: counts[2],
			questions,
			quizzes,
			total_users,
			users
		});

		await createFolders({
			count: counts[3],
			folders,
			total_users,
			users
		});

		await createEnvironments({
			count: counts[4],
			envs,
			users,
			total_users
		});
		const data = loginData.map(({ password, username, email }) => ({ password, username, email }));
		if (deletePrev) fs.writeFileSync(`${__dirname}/store/loginData.json`, JSON.stringify(data), 'UTF-8');
		else {
			const new_data = JSON.parse(fs.readFileSync(`${__dirname}/store/loginData.json`, 'UTF-8'));
			new_data.push(...data);
			fs.writeFileSync(`${__dirname}/store/loginData.json`, JSON.stringify(new_data), 'UTF-8');
		}
	}

	process.exit();
})();
