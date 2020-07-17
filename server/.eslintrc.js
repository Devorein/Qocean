module.exports = {
	env: {
		browser: false,
		commonjs: true,
		es6: true,
		node: true,
		'jest/globals': true
	},
	parser: 'babel-eslint',
	extends: [ 'eslint:recommended' ],
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly'
	},
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2018
	},
	plugins: [ 'prettier', 'jest' ],
	rules: {
		'no-mixed-spaces-and-tabs': 'off',
		'jest/no-disabled-tests': 'warn',
		'jest/valid-expect': 'error',
		'jest/no-identical-title': 'error',
		'jest/no-standalone-expect': 'error'
	}
};
