const casual = require('casual');
const axios = require('axios');
const randomColor = require('randomcolor');

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

const icons = [ 'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Indigo', 'Purple' ];

casual.define('environment', function() {
	const times = [ 15, 30, 45, 60, 75, 90, 105, 120 ];
	const time = times[getRandomInt(0, times.length - 1)];
	const notification_timings = [ 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000 ];
	const notification_timing = notification_timings[getRandomInt(0, notification_timings.length - 1)];
	const resources = [ 'User', 'Question', 'Quiz', 'Folder', 'Environment' ];
	const ipp = [ 10, 15, 20, 25, 30, 40, 50 ];

	const envObj = {
		name: casual.array_of_words(2).join(''),
		icon: `${icons[getRandomInt(0, icons.length - 1)]}`,
		favourite: casual.boolean,
		public: casual.boolean,
		theme: [ 'Light', 'Dark', 'Navy' ][getRandomInt(0, 2)],
		animation: casual.boolean,
		hovertips: casual.boolean,
		sound: casual.boolean,
		question: {
			default_timing: time,
			default_type: [ 'FIB', 'Snippet', 'MCQ', 'MS', 'FC', 'TF' ][getRandomInt(0, 5)],
			default_difficulty: [ 'Beginner', 'Intermediate', 'Advanced' ][getRandomInt(0, 2)],
			default_weight: getRandomInt(1, 10)
		},
		reset_on_success: casual.boolean,
		reset_on_error: casual.boolean,
		default_create_landing: resources.splice(1)[getRandomInt(0, resources.length - 2)],
		notification_timing,
		max_notifications: getRandomInt(3, 10),
		primary_color: randomColor(),
		secondary_color: randomColor()
	};

	[ 'explore', 'self', 'watchlist', 'play' ].forEach((page) => {
		const target = {};
		envObj[`${page}_page`] = target;
		target[`default_ipp`] = ipp[getRandomInt(0, ipp.length - 1)];
		target[`default_view`] = [ 'Table', 'List', 'Board', 'Gallery' ][getRandomInt(0, 3)];
		target[`default_layout`] = [ 'Right', 'Left' ][getRandomInt(0, 1)];
		target[`default_landing`] = ((page) => {
			if (page === 'explore') return resources[getRandomInt(0, resources.length - 1)];
			else if (page === 'self') return resources.slice(1)[getRandomInt(0, resources.length - 2)];
			else if (page.match(/(watchlist|play)/)) return [ 'Quiz', 'Folder' ][getRandomInt(0, 1)];
			else return [];
		})(page);
	});
	return envObj;
});

const createEnvironment = async ({ envs, users, total_users }) => {
	const environment = casual.environment;
	try {
		const user = users[getRandomInt(0, total_users - 1)];
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
	} catch (err) {
		console.log(err.message);
	}
};

async function createEnvironments({ count, envs, users, total_users }) {
	let created = 1;
	return new Promise((resolve, reject) => {
		const environmentsInterval = setInterval(async () => {
			if (created <= count) {
				await createEnvironment({ envs, users, total_users });
				console.log(`Created Environment ${created}`);
				created++;
			} else {
				clearInterval(environmentsInterval);
				resolve('Environments created');
			}
		}, 500);
	});
}

module.exports = {
	createEnvironments
};
