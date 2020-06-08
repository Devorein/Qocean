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
		refs = [];
	if (authenticated) secondary.push('public', 'favourite');
	if (type === 'quiz') {
		secondary.push('subject', 'tags');
		tertiary.push('total_questions', 'average_difficulty', 'average_quiz_time', 'ratings', 'total_played');
		if (authenticated) {
		}
	} else if (type === 'question') {
		secondary.push('difficulty', 'quiz', 'type');
		tertiary.push('weight', 'time_allocated');
	} else if (type === 'user') {
	} else if (type === 'folder') {
		primary.push('icon');
		tertiary.push('ratings', 'watchers', 'total_questions', 'total_quizzes');
	} else if (type === 'environment') {
		primary.push('icon');
	}

	if (purpose === 'detail') {
		if (type === 'quiz') {
			primary.push('image');
			secondary.push('source');
			tertiary.push('raters', 'ratings', 'total_folders');
			if (authenticated) {
				refs.push('folders', 'questions', 'watchers');
			}
		} else if (type === 'question') {
		} else if (type === 'user') {
		} else if (type === 'folder') {
		} else if (type === 'environment') {
		}
	}

	primary.push('name');
	tertiary.push('created_at', 'updated_at');

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
		primary.forEach((prop) => (temp['primary'][prop] = data[prop]));
		secondary.forEach((prop) => (temp['secondary'][prop] = data[prop]));
		tertiary.forEach((prop) => (temp['tertiary'][prop] = data[prop]));
		refs.forEach((prop) => (temp['refs'][prop] = data[prop]));
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
