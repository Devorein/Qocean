module.exports = {
	testTimeout: 30000,
	displayName: {
		name: 'SERVER',
		color: 'green'
	},
	testEnvironment: 'node',
	globalSetup: './tests/globalSetup.js',
	globalTeardown: './tests/globalTeardown.js'
};
