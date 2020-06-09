export default function(type, queryParams, authenticated) {
	type = type.toLowerCase();
	if (type.match(/(user|users)/)) {
		queryParams.populate = 'quizzes,questions,folders,environments';
		queryParams.populateFields = 'name-name-name-name';
	} else if (type.match(/(folder|folders)/)) {
		queryParams.populate = 'user,quizzes,watchers';
		queryParams.populateFields = 'username-name-username';
	} else if (type.match(/(quiz|quizzes)/)) {
		queryParams.populate = 'user,folders,questions,watchers';
		queryParams.populateFields = 'username-name-name-username';
	} else if (type.match(/(question|questions)/)) {
		queryParams.populate = 'user,quiz';
		queryParams.populateFields = 'username-name';
	} else if (type.match(/(environment|environments)/)) {
		queryParams.populate = 'user';
		queryParams.populateFields = 'username';
	}
}
