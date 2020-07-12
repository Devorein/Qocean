const fs = require('fs');

const resolvers = {};
const files = fs.readdirSync(__dirname);

files.forEach((file) => {
	const [ filename ] = file.split('.');
	if (!filename.match(/(index|auth|base)/)) resolvers[filename] = require(`./${filename}.js`);
});

module.exports = resolvers;
