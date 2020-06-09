export default function(type, queryParams, authenticated) {
	type = type.toLowerCase();

	if (type.match(/(user|users)/)) {
		queryParams.populate = 'quizzes,questions,folders,envrionments';
		queryParams.populateFields = 'name-name-name-name';
	} else if (type.match(/(folder|folders)/)) {
		queryParams.populate = 'quizzes,watchers';
		queryParams.populateFields = 'name-username';
	} else if (type.match(/(quiz|quizzes)/)) {
		queryParams.populate = 'folders,questions,watchers';
		queryParams.populateFields = 'name-name-username';
	} else if (type.match(/(question|questions)/)) {
		queryParams.populate = 'quiz';
		queryParams.populateFields = 'name';
	} else if (type.match(/(environment|environments)/)) {
		queryParams.populate = '';
		queryParams.populateFields = '';
	}
}
