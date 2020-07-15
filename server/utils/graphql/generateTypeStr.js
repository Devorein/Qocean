module.exports = function ({ comment, startStr, obj }) {
	let objStr = `# ${comment} \n`;
	Object.entries(obj).forEach(([key, value]) => {
		const valueEntries = Object.entries(value);
		if (valueEntries.length !== 0) {
			if (typeof startStr === 'function') objStr += startStr({ key, value });
			else objStr += `${startStr} ${key}{\n`;
			if (Array.isArray(value)) objStr += `\t${value.join('\n\t')}\n}\n\n`;
			else
				valueEntries.forEach(([innerKey, innerValue], index, arr) => {
					objStr += `${'\t' + innerKey + ': ' + innerValue.value}\n${
						index === arr.length - 1 ? '}\n' : ''
					}`;
				});
		}
	});
	return objStr + '\n';
};
