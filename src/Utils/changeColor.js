const colorConvert = require('color-convert');

module.exports = (color) => {
	let rgb = null;
	if (!color.includes('#')) rgb = colorConvert.keyword.rgb(color);
	else rgb = colorConvert.hex.rgb(color);
	const brightness = Math.round((parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000);
	return brightness > 125 ? 'black' : 'white';
};
