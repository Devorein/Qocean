const casual = require('casual');
const axios = require('axios');

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

const icons = [ 'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Indigo', 'Purple' ];

casual.define('folder', function() {
	let name = casual.array_of_words(2).join('');
	while (name.length > 20) name = casual.array_of_words(2).join('');
	return {
		name,
		icon: `${icons[getRandomInt(0, icons.length - 1)]}`,
		favourite: casual.boolean,
		public: casual.boolean
	};
});

const createFolder = async ({ folders, total_users, users }) => {
	const folder = casual.folder;
	try {
		const user = users[getRandomInt(0, total_users - 1)];
		const quiz = user.quizzes[getRandomInt(0, user.quizzes.length - 1)];
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
	} catch (err) {
		console.log(err.message);
	}
};

async function createFolders({ count, folders, total_users, users }) {
	let created = 1;
	return new Promise((resolve, reject) => {
		const folderInterval = setInterval(async () => {
			if (created <= count) {
				await createFolder({ folders, total_users, users });
				console.log(`Created Folder ${created}`);
				created++;
			} else {
				clearInterval(folderInterval);
				resolve('Folders created');
			}
		}, 500);
	});
}

module.exports = {
	createFolders
};
