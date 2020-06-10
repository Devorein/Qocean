import { difference } from 'lodash';

export default function(
	data,
	type,
	{ authenticated, flatten = false, singular = false, blacklist = [], purpose, singularSectorize = false }
) {
	type = type.toLowerCase();
	const primary = [],
		secondary = [],
		tertiary = [],
		refs = [],
		ref = [];

	if (type.match(/(quiz|quizzes)/)) {
		secondary.push('subject', 'tags');
		tertiary.push('total_questions', 'average_difficulty', 'average_quiz_time', 'ratings', 'total_played');
		if (authenticated) {
		}
	} else if (type.match(/(question|questions)/)) {
		secondary.push('difficulty', 'type');
		tertiary.push('weight', 'time_allocated');
		ref.push('quiz');
	} else if (type.match(/(user|users)/)) {
		primary.push('username');
		secondary.push('email', 'version');
		tertiary.push('total_quizzes', 'total_questions', 'total_folders', 'total_environments', 'joined_at');
	} else if (type.match(/(folder|folders)/)) {
		primary.push('icon');
		tertiary.push('ratings', 'total_questions', 'total_quizzes');
	} else if (type.match(/(environment|environments)/)) {
		primary.push('icon');
	}

	if (purpose === 'detail') {
		if (type.match(/(quiz|quizzes)/)) {
			primary.push('image');
			secondary.push('source');
			tertiary.push('raters', 'ratings', 'total_folders');
			refs.push('folders', 'questions', 'watchers');
		} else if (type.match(/(question|questions)/)) {
			primary.push('image');
			tertiary.push('format', 'add_to_score');
		} else if (type.match(/(user|users)/)) {
			primary.push('image', 'email', 'username');
			tertiary.push('joined_at');
			ref.push('current_environment');
			refs.push('quizzes', 'questions', 'environments', 'folders');
		} else if (type.match(/(folder|folders)/)) {
			refs.push('quizzes', 'watchers');
		} else if (type.match(/(environment|environments)/)) {
			tertiary.push(
				...Object.keys(data).filter(
					(key) =>
						!primary.includes(key) &&
						!secondary.includes(key) &&
						!ref.includes(key) &&
						!key.match(/^(id|_id|__v|user|name|public|favourite)$/)
				)
			);
		}
	}

	primary.push('name');
	if (!type.match(/(user|users)/)) {
		tertiary.push('created_at', 'updated_at');
		ref.push('user');
		if (authenticated) secondary.push('public', 'favourite');
	}

	if (flatten) {
		return data.map((data) => {
			const temp = {};
			difference(primary, blacklist).forEach((prop) => (temp[prop] = data[prop]));
			difference(secondary, blacklist).forEach((prop) => (temp[prop] = data[prop]));
			difference(tertiary, blacklist).forEach((prop) => (temp[prop] = data[prop]));
			temp._id = data._id;
			temp.actions = data.actions;
			temp.checked = data.checked;
			return temp;
		});
	} else if (singular) {
		const temp = {};
		primary.forEach((prop) => (temp[prop] = data[prop]));
		secondary.forEach((prop) => (temp[prop] = data[prop]));
		tertiary.forEach((prop) => (temp[prop] = data[prop]));
		refs.forEach((prop) => (temp[prop] = data[prop]));
		return temp;
	} else if (singularSectorize) {
		const temp = {};
		temp.primary = {};
		temp.secondary = {};
		temp.tertiary = {};
		temp.refs = {};
		temp.ref = {};
		primary.forEach((prop) => (temp['primary'][prop] = data[prop]));
		secondary.forEach((prop) => (temp['secondary'][prop] = data[prop]));
		tertiary.forEach((prop) => (temp['tertiary'][prop] = data[prop]));
		refs.forEach((prop) => (temp['refs'][prop] = data[prop]));
		ref.forEach((prop) => (temp['ref'][prop] = data[prop]));
		temp._id = data._id;
		return temp;
	} else {
		return data.map((data) => {
			const temp = {};
			temp.primary = {};
			temp.secondary = {};
			temp.tertiary = {};
			difference(primary, blacklist).forEach((prop) => (temp['primary'][prop] = data[prop]));
			difference(secondary, blacklist).forEach((prop) => (temp['secondary'][prop] = data[prop]));
			difference(tertiary, blacklist).forEach((prop) => (temp['tertiary'][prop] = data[prop]));
			temp._id = data._id;
			temp.actions = data.actions;
			temp.checked = data.checked;
			return temp;
		});
	}
}
