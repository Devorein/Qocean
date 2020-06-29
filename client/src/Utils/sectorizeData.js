import { difference } from 'lodash';

export default function(data, type, { authenticated, flatten = false, blacklist = [], purpose, page = 'self' }) {
	type = type.toLowerCase();
	page = page.toLowerCase();
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
				...Object.keys(data || {}).filter(
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
		if (!page.match(/play|self/)) ref.push('user');
		if (authenticated && page.match(/(self|play)/)) secondary.push('public', 'favourite');
	}

	function mapToSector(data) {
		const temp = {};
		temp._id = data._id;
		if (!blacklist.includes('actions')) temp.actions = data.actions;
		if (!blacklist.includes('checked')) temp.checked = data.checked;
		[
			[ primary, 'primary' ],
			[ secondary, 'secondary' ],
			[ tertiary, 'tertiary' ],
			[ refs, 'refs' ],
			[ ref, 'ref' ]
		].forEach(([ array, sector ]) => {
			let target = temp;
			if (!flatten) {
				temp[sector] = {};
				target = temp[sector];
			}
			difference(array, blacklist).forEach((prop) => (target[prop] = data[prop]));
		});
		return temp;
	}
	if (!data) return { primary, secondary, tertiary, ref, refs };
	else if (Array.isArray(data)) return data.map((item) => mapToSector(item));
	else return mapToSector(data);
}
