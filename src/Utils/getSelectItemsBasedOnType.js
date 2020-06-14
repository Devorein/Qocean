export default function(type, page) {
	page = page.toLowerCase();
	type = type.toLowerCase();
	const commonsorts = [ 'none', 'name', 'public', 'favourite', 'created_at', 'updated_at' ];
	if (page !== 'self') commonsorts.push('user');
	let selectItems = [];
	if (type === 'quiz')
		selectItems = [
			...commonsorts,
			'ratings',
			'subject',
			'average_quiz_time',
			'average_difficulty',
			'tags',
			'watchers',
			'total_questions'
		];
	else if (type === 'question') selectItems = [ ...commonsorts, 'difficulty', 'type', 'time_allocated', 'quiz' ];
	else if (type === 'folder') selectItems = [ ...commonsorts, 'icon', 'watchers', 'total_quizzes', 'total_questions' ];
	else if (type === 'environment') selectItems = [ ...commonsorts, 'icon' ];
	else if (type === 'user')
		selectItems = [
			'none',
			'name',
			'username',
			'gmail',
			'joined_at',
			'total_environments',
			'total_folders',
			'total_questions',
			'total_quizzes',
			'version'
		];
	else selectItems = [ 'none' ];
	return selectItems.map((name) => ({
		value: name,
		text: name.split('_').map((chunk) => chunk.charAt(0).toUpperCase() + chunk.substr(1)).join(' ')
	}));
}
