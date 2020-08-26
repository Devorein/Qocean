export const setNestedFields = (object, path, value) => {
	const root = object;
	const pathArray = path.split('.');
	for (let i = 0; i < pathArray.length; i++) {
		const p = pathArray[i];
		if (!isPOJO(object[p])) object[p] = {};
		if (i === pathArray.length - 1) object[p] = value;
		object = object[p];
	}
	return root;
};

export function isPOJO (arg) {
	if (arg == null || typeof arg !== 'object') return false;
	const proto = Object.getPrototypeOf(arg);
	if (proto == null) return true;
	return proto === Object.prototype;
}
