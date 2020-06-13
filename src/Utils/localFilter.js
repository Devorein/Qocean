export default function(filter) {
	const { targetType, mod, value, against } = filter;
	if (targetType === 'string') {
		if (mod === 'contains') {
			const regex = new RegExp(value, 'g');
			if (regex.exec(against)) return true;
		}
	}
}
