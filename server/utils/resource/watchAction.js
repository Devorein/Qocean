const mongoose = require('mongoose');

module.exports = async function watchAction(rtype, body, user) {
	const resources = body[rtype];
	const watchlist = await mongoose.model('Watchlist').findById(user.watchlist);
	let manipulated = 0;

	function detectWatchStatus(resource) {
		if (
			watchlist[`watched_${rtype}`].indexOf(resource._id.toString()) !== -1 &&
			resource.watchers.indexOf(user._id) !== -1
		)
			return 'remove';
		else if (
			watchlist[`watched_${rtype}`].indexOf(resource._id.toString()) === -1 &&
			resource.watchers.indexOf(user._id.toString()) === -1 &&
			!user[rtype].includes(resource._id.toString())
		)
			return 'add';
	}

	function removeFromWatched(resource) {
		resource.watchers = resource.watchers.filter(
			(watcher) => watcher === user._id.toString()
		);
		watchlist[`watched_${rtype}`] = watchlist[`watched_${rtype}`].filter(
			(watched_resource) =>
				watched_resource.toString() !== resource._id.toString()
		);
		manipulated++;
	}

	function addToWatched(resource) {
		resource.watchers.push(user._id.toString());
		watchlist[`watched_${rtype}`].push(resource._id.toString());
		manipulated++;
	}

	for (let i = 0; i < resources.length; i++) {
		const resourceId = resources[i];
		const resource = await (rtype === 'quizzes'
			? mongoose.model('Quiz')
			: mongoose.model('Folder')
		).findById(resourceId);

		const status = detectWatchStatus(resource);
		if (status === 'remove') removeFromWatched(resource);
		else if (status === 'add') addToWatched(resource);
		await resource.save();
	}
	await watchlist.save();
	return manipulated;
};
