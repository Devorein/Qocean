const casual = require('casual');
const faker = require('faker');
const axios = require('axios');

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

casual.define('user', function() {
	return {
		email: faker.internet.email(),
		name: casual.first_name + ' ' + casual.last_name,
		password: casual.password,
		username: casual.password.toLowerCase(),
		image: `https://robohash.org/${casual.array_of_words(getRandomInt(1, 3)).join('')}`,
		version: [ 'Rower', 'Sailor', 'Captain' ][getRandomInt(0, 2)]
	};
});

const createUser = async (users, loginData) => {
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

async function createUsers(count, users, loginData) {
	return new Promise((resolve, reject) => {
		const userInterval = setInterval(async () => {
			if (users.length < count) await createUser(users, loginData);
			else {
				clearInterval(userInterval);
				resolve('Users created');
			}
		}, 500);
	});
}

module.exports = {
	createUsers
};
