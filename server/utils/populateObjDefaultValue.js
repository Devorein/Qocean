module.exports = function populateObjDefaultValue(obj, fields) {
	Object.entries(fields).forEach(([ key, defvalue ]) => {
		if (obj[key] === undefined) obj[key] = defvalue;
		else {
			console.log(key);
			obj[key] = { ...defvalue, ...obj[key] };
		}
	});
};
