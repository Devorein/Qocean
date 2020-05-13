const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Lod env variables
dotenv.config({ path: './config/config.env' });

// Load models
const Quiz = require('./models/Quiz');
const Question = require('./models/Question');
const User = require('./models/User');
const Settings = require('./models/Settings');
const Folder = require('./models/Folder');

// Connect to db
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
	useUnifiedTopology: true
});

// Read JSON files
const quizes = JSON.parse(fs.readFileSync(`${__dirname}/data/quiz.json`, 'UTF-8'));
const questions = JSON.parse(fs.readFileSync(`${__dirname}/data/question.json`, 'UTF-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/data/user.json`, 'UTF-8'));
const settings = JSON.parse(fs.readFileSync(`${__dirname}/data/settings.json`, 'UTF-8'));
const folders = JSON.parse(fs.readFileSync(`${__dirname}/data/folder.json`, 'UTF-8'));

// Import into db
const importData = async (exit = true) => {
	try {
		await Quiz.create(quizes);
		await Question.create(questions);
		await User.create(users);
		await Settings.create(settings);
		await Folder.create(folders);
		console.log(`Quizes imported ...`.green.inverse);
		console.log(`Questions imported ...`.green.inverse);
		console.log(`Users imported ...`.green.inverse);
		console.log(`Settings imported ...`.green.inverse);
		console.log(`Folders imported ...`.green.inverse);
		if (exit) process.exit();
	} catch (err) {
		console.error(err);
		process.exit();
	}
};

const deleteData = async (exit = true) => {
	try {
		await Quiz.deleteMany();
		await Question.deleteMany();
		await User.deleteMany();
		await Settings.deleteMany();
		await Folder.deleteMany();
		console.log(`Quizes destroyed ...`.red.inverse);
		console.log(`Questions destroyed ...`.red.inverse);
		console.log(`User destroyed ...`.red.inverse);
		console.log(`Settings destroyed ...`.red.inverse);
		console.log(`Folders destroyed ...`.red.inverse);
		if (exit) process.exit();
	} catch (err) {
		console.error(err);
		process.exit();
	}
};

if (process.argv[2] === '-i') importData();
else if (process.argv[2] === '-d') deleteData();
else if (process.argv[2] === '-b') {
	(async () => {
		await deleteData(false);
		await importData(false);
		process.exit();
	})();
}
