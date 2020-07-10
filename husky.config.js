module.exports = {
	hooks: {
		'pre-commit': 'cd ./server && eslint .'
	}
};
