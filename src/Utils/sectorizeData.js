export default function(data, type, { authenticated, singular = false }) {
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

	if (!singular)
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
	else {
		const temp = {};
		primary.forEach((prop) => (temp[prop] = data[prop]));
		secondary.forEach((prop) => (temp[prop] = data[prop]));
		tertiary.forEach((prop) => (temp[prop] = data[prop]));
		return temp;
	}
}
