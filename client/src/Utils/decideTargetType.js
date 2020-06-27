function convertToSelectItems(arr) {
	return arr.map((name) => ({
		value: name,
		text: name.split('_').map((chunk) => chunk.charAt(0).toUpperCase() + chunk.substr(1)).join(' ')
	}));
}

export default function(target, config = {}) {
	const { shouldConvertToSelectItems = true, shouldConvertToAcronym = false } = config;
	let targetType = null,
		modValues = [];
	if (target.match(/^(string|name|subject|quiz|email)$/)) {
		targetType = 'string';
		modValues = [
			'is',
			'is_(case)',
			'starts_with',
			'starts_with_(case)',
			'ends_with',
			'ends_with_(case)',
			'contains',
			'contains_(case)',
			'regex'
		];
	} else if (target.match(/^(boolean|public|favourite)$/)) {
		targetType = 'boolean';
		modValues = [ 'is', 'is_not' ];
	} else if (target.match(/^(date|created_at|updated_at|joined_at)$/)) {
		targetType = 'date';
		modValues = [
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
		];
	} else if (
		target.match(
			/^(number|ratings|average_quiz_time|watchers|total_questions|time_allocated|total_quizzes|total_environments|total_folders)$/
		)
	) {
		targetType = 'number';
		modValues = [
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
		];
	} else if (target.match(/^(tags)$/)) {
		targetType = 'array';
		modValues = [ 'length_is', 'length_greater_than', 'length_less_than', 'contains' ];
	} else if (target.match(/(difficulty|icon|type|average_difficulty|version|user)$/)) {
		targetType = 'select';
		modValues = [ 'is', 'is_not' ];
	} else {
		targetType = 'none';
		modValues = [ 'none' ];
	}
	if (shouldConvertToAcronym)
		modValues = modValues.map((modValue) =>
			modValue.replace(/\((\w+)\)/g, '$1').split('_').map((chunk) => chunk.charAt(0)).join('')
		);
	if (shouldConvertToSelectItems) return { targetType, modValues: convertToSelectItems(modValues) };
	else return { targetType, modValues };
}
