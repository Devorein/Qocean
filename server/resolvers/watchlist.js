module.exports = {
	Watchlist: {
		async watched_folders(parent, args, { user, Folder }) {
			return await Folder.find({ public: true, user: user.id, _id: { $in: [ parent.watched_folders ] } });
		},
		async watched_quizzes(parent, args, { user, Quiz }) {
			return await Quiz.find({ public: true, user: user.id, _id: { $in: [ parent.watched_quizzes ] } });
		}
	}
};
