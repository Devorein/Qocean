export default function(filter) {
	const { targetType, mod, value, against } = filter;
	if (targetType === 'string') {
		if (mod === 'i') return against.toLowerCase() === value.toLowerCase();
		else if (mod === 'ic') return against === value;
		else if (mod === 'c') {
			const regex = new RegExp(value, 'ig');
			if (regex.exec(against)) return true;
		} else if (mod === 'cc') {
			const regex = new RegExp(value, 'g');
			if (regex.exec(against)) return true;
		} else if (mod === 'sw') {
			const regex = new RegExp(`^${value}`, 'ig');
			if (regex.exec(against)) return true;
		} else if (mod === 'swc') {
			const regex = new RegExp(`^${value}`, 'g');
			if (regex.exec(against)) return true;
		} else if (mod === 'ew') {
			const regex = new RegExp(`${value}$`, 'ig');
			if (regex.exec(against)) return true;
		} else if (mod === 'ewc') {
			const regex = new RegExp(`${value}$`, 'g');
			if (regex.exec(against)) return true;
		} else if (mod === 'r') {
			const regexsplitter = /^\/(.+)\//g;
			let regexValue = regexsplitter.exec(value);
			regexValue = regexValue ? regexValue[1] : '';
			const modifiers = regexValue ? value.substr(value.lastIndexOf('/') + 1) : '';
			const regex = new RegExp(`${regexValue}`, `${modifiers}`);
			if (regex.exec(against)) return true;
		}
	}
}
