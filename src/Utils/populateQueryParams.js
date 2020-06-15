export default function(type, queryParams, authenticated, page) {
	type = type.toLowerCase();
	if (type.match(/(user|users)/)) {
		const commonpopulate = 'quizzes,questions,folders,environments';
		const commonpopulateFields = 'name-name-name-name';
		queryParams.populate = `${commonpopulate}`;
		queryParams.populateFields = `${commonpopulateFields}`;
		if (authenticated) {
			queryParams.populate = `${commonpopulate},watchlist`;
			queryParams.populateFields = `${commonpopulateFields}-watched_folders,watched_quizzes`;
		}
	} else if (type.match(/(folder|folders)/)) {
		queryParams.populate = 'user,quizzes,watchers';
		queryParams.populateFields = 'username-name-username';
	} else if (type.match(/(quiz|quizzes)/)) {
		queryParams.populate = 'user,folders,questions,watchers';
		if (page === 'play') queryParams.populateFields = 'username-name-name,time_allocated,difficulty,type-username';
		else queryParams.populateFields = 'username-name-name-username';
	} else if (type.match(/(question|questions)/)) {
		queryParams.populate = 'user,quiz';
		queryParams.populateFields = 'username-name';
	} else if (type.match(/(environment|environments)/)) {
		queryParams.populate = 'user';
		queryParams.populateFields = 'username';
	}
}
