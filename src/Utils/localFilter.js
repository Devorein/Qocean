export default function(filter) {
	const { targetType, mod } = filter;
	let { against = '', value = '' } = filter;
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
	} else if (targetType === 'boolean') {
		against = against.toString();
		if (value === 'false' && mod === 'in') return against === 'true';
		else if (value === 'false' && mod === 'i') return against === 'false';
		else if (value === 'true' && mod === 'i') return against === 'true';
		else if (value === 'true' && mod === 'in') return against === 'false';
	} else if (targetType === 'number') {
		if (mod.match(/^(i|in|gt|gte|lt|lte)$/)) {
			value = parseInt(value);
			against = parseInt(against);
			console.log(value, against);
			if (mod === 'i') return value === against;
			else if (mod === 'in') return value !== against;
			else if (mod === 'gt') return value < against;
			else if (mod === 'gte') return value <= against;
			else if (mod === 'lt') return value > against;
			else if (mod === 'lte') return value >= against;
		} else if (mod.match(/^(bi|be|nbi|nbe)$/)) {
			value = value.toString();
			let [ low = 0, high = 0 ] = value.split(',');
			low = parseInt(low);
			high = parseInt(high);
			if (mod === 'bi') return Math.min(low, high) <= against && Math.max(low, high) >= against;
			else if (mod === 'be') return Math.min(low, high) < against && Math.max(low, high) > against;
			else if (mod === 'nbi') return Math.max(low, high) < against || Math.min(low, high) > against;
			else if (mod === 'nbe') return Math.max(low, high) <= against && Math.min(low, high) >= against;
		}
	} else if (targetType === 'select') {
		const values = value.split(',');
		if (mod === 'i') return values.includes(against);
		else if (mod === 'in') return !values.includes(against);
	}
}
