const fs = require('fs');

const typedefs = {};
const files = fs.readdirSync(__dirname);

files.forEach((file) => {
	const [filename] = file.split('.');
	if (!filename.match(/(index|Auth|Base)/))
		typedefs[filename.toLowerCase()] = require(`./${filename}.js`);
});

module.exports = typedefs;
