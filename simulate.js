const axios = require('axios');
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

	/* const fileArg = args.indexOf('-f'); 
  const file = fileArg */
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

	let counts = [];

	const amountsIndex = args.indexOf('-amnt');
	if (amountsIndex !== -1) {
		const amounts = args[amountsIndex + 1];
		if (!amounts.startsWith('-')) {
			counts = amounts.split(',').map((count) => parseInt(count));
			counts = counts.concat(Array(5 - counts.length).fill(counts[counts.length - 1]));
		}
	} else {
		counts = [
			getRandomInt(10, 25),
			getRandomInt(30, 50),
			getRandomInt(50, 75),
			getRandomInt(10, 25),
			getRandomInt(35, 50)
		];
	}

	if (createMode === 'specified') {
		const username = args[userArg + 1];
		const { email, password } = JSON.parse(fs.readFileSync(`${__dirname}/store/loginData.json`, 'UTF-8')).find(
			(user) => user.username === username
		);

		const { data: { token, _id } } = await axios.post(`http://localhost:5001/api/v1/auth/login`, {
			email,
			password
		});

		const headers = {
			headers: {
				Authorization: `Bearer ${token}`
			}
		};

		let { data: { data: quizzes } } = await axios.get(`http://localhost:5001/api/v1/quizzes/me?select=_id,questions`, {
			...headers
		});

		let { data: { data: questions } } = await axios.get(`http://localhost:5001/api/v1/questions/me?select=_id`, {
			...headers
		});

		let { data: { data: folders } } = await axios.get(`http://localhost:5001/api/v1/folders/me?select=_id`, {
			...headers
		});

		let { data: { data: envs } } = await axios.get(`http://localhost:5001/api/v1/environments/me?select=_id`, {
			...headers
		});

		quizzes = quizzes.map(({ _id, questions }) => ({ _id, questions }));
		questions = questions.map(({ _id }) => _id);
		folders = folders.map(({ _id }) => _id);
		envs = envs.map(({ _id }) => _id);

		let resources_tb_created = [];
		const resourceType = args[args.indexOf('-rt') + 1];
		if (!resourceType || resourceType.startsWith('-')) resources_tb_created = [ 2, 3, 4, 5 ];
		else
			resources_tb_created = resourceType
				.split(',')
				.map((type) => parseInt(type))
				.filter((type) => type >= 2 && type <= 5);

		const users = [
			{
				_id,
				token,
				quizzes: quizzes.map(({ _id }) => _id),
				questions,
				folders,
				envs
			}
		];

		if (resources_tb_created.includes(2))
			await createQuizzes({
				count: counts[0],
				users,
				total_users: 1,
				quizzes
			});

		if (resources_tb_created.includes(3))
			await createQuestions({
				count: counts[1],
				questions,
				quizzes,
				total_users: 1,
				users
			});

		if (resources_tb_created.includes(4))
			await createFolders({
				count: counts[2],
				folders,
				total_users: 1,
				users
			});

		if (resources_tb_created.includes(5))
			await createEnvironments({
				count: counts[3],
				envs,
				users,
				total_users: 1
			});
	} else if (createMode === 'all') {
		const users = [],
			quizzes = [],
			questions = [],
			folders = [],
			envs = [],
			loginData = [];

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

		const data = loginData.map(({ password, username, email, token }) => ({ password, username, email, token }));
		if (deletePrev) fs.writeFileSync(`${__dirname}/store/loginData.json`, JSON.stringify(data), 'UTF-8');
		else {
			const new_data = JSON.parse(fs.readFileSync(`${__dirname}/store/loginData.json`, 'UTF-8'));
			new_data.push(...data);
			fs.writeFileSync(`${__dirname}/store/loginData.json`, JSON.stringify(new_data), 'UTF-8');
		}
	}

	process.exit();
})();
