module.exports = {
	env: {
		browser: true,
		es6: true
	},
	extends: [ 'eslint:recommended', 'plugin:react/recommended' ],
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly'
	},
	parserOptions: {
		ecmaFeatures: {
			jsx: true
		},
		ecmaVersion: 2018,
		sourceType: 'module'
	},
	plugins: [ 'react' ],
	rules: {
		indent: [ 'error', 'tab' ],
		'linebreak-style': [ 'error', 'windows' ],
		quotes: [ 'error', 'single' ],
		semi: [ 'error', 'always' ]
	}
};
