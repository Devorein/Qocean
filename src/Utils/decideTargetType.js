function convertToSelectItems(arr) {
	return arr.map((name) => ({
		value: name,
		text: name.split('_').map((chunk) => chunk.charAt(0).toUpperCase() + chunk.substr(1)).join(' ')
	}));
}

export default function(target) {
	let targetType = null,
		modValue = [];
	if (target.match(/^(name|subject|quiz|email)$/)) {
		targetType = 'string';
		modValue = convertToSelectItems([ 'is', 'starts_with', 'ends_with', 'contains', 'regex' ]);
	} else if (target.match(/^(public|favourite)$/)) {
		targetType = 'boolean';
		modValue = convertToSelectItems([ 'is', 'is_not' ]);
	} else if (target.match(/^(created_at|updated_at|joined_at)$/)) {
		targetType = 'date';
		modValue = convertToSelectItems([
			'exact',
			'today',
			'yesterday',
			'within',
			'last_week',
			'within_last_week',
			'last_month',
			'within_last_month',
			'last_year',
			'within_last_year'
		]);
	} else if (
		target.match(
			/^(ratings|average_quiz_time|watchers|total_questions|time_allocated|total_quizzes|total_environments|total_folders)$/
		)
	) {
		targetType = 'number';
		modValue = convertToSelectItems([
			'is',
			'is_not',
			'greater_than',
			'less_than',
			'greater_than_equal',
			'less_than_equal',
			'between_inclusive',
			'between_exclusive',
			'not_between_inclusive',
			'not_between_exclusive'
		]);
	} else if (target.match(/^(tags)$/)) targetType = 'array';
	else if (target.match(/(difficulty|icon|type|average_difficulty|version)$/)) {
		targetType = 'select';
		modValue = convertToSelectItems([ 'is', 'is_not' ]);
	} else {
		targetType = 'none';
		modValue = convertToSelectItems([ 'none' ]);
	}
	return [ targetType, modValue ];
}
