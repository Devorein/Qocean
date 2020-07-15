function isPOJO (arg) {
	if (arg == null || typeof arg !== 'object') return false;
	const proto = Object.getPrototypeOf(arg);
	if (proto == null) return true; // `Object.create(null)`
	return proto === Object.prototype;
}

module.exports = function populateObjDefaultValue (obj, fields) {
	if (obj.__undefineds === undefined) obj.__undefineds = [];
	Object.entries(fields).forEach(([ key, defvalue ]) => {
		if (obj[key] === undefined) {
			obj[key] = defvalue;
			obj.__undefineds.push(key);
		} else if (isPOJO(defvalue)) obj[key] = { ...defvalue, ...obj[key] };
	});
};
