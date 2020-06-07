export default function(data, type, authenticated) {
	type = type.toLowerCase();
	const primary = [ 'name' ],
		secondary = [],
		tertiary = [ 'public', 'favourite' ];

	if (authenticated) {
		if (type === 'quiz') {
			primary.push('name');
			secondary.push('subject', 'tags');
			tertiary.push('total_questions');
		}
	}

	return data.map((data) => {
		const temp = {};
		temp.primary = {};
		temp.secondary = {};
		temp.tertiary = {};
		primary.forEach((prop) => (temp['primary'][prop] = data[prop]));
		secondary.forEach((prop) => (temp['secondary'][prop] = data[prop]));
		tertiary.forEach((prop) => (temp['tertiary'][prop] = data[prop]));
		temp._id = data._id;
		temp.actions = data.actions;
		return temp;
	});
}
