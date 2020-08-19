const watchAction = require('../utils/resource/watchAction');
const addRatings = require('../utils/resource/addRatings');

module.exports = {
	Mutation: {
		async updateFoldersRatings (parent, { data }, ctx) {
			return await addRatings(ctx.folder, data, ctx.user.id, (err) => {
				throw err;
			});
		},
		async updateFoldersWatch (parent, { ids }, { User, user }) {
			return await watchAction('folders', { folders: ids }, await User.findById(user.id));
		},
		async changeFolderQuizzes (parent, { data }, { Quiz, Folder }) {
			const operation_str = (middle) => (op === 1 ? 'added ' + middle + ' to' : 'removed ' + quiz + ' from');
			const { op, quiz, folder } = data;
			const _quiz = await Quiz.findById(quiz);
			if (!_quiz) throw new Error(`No quiz found with id ${quiz}`);
			const _folder = await Folder.findById(folder);
			if (!_quiz) throw new Error(`No folder found with id ${folder}`);
			if (op !== 1 && op !== 0) throw new Error(`Wrong operation on folder`);
			await _folder.quiz(op, quiz);
			await _folder.save();
			return { success: true, message: `Successfully ${operation_str('Quiz' + quiz)} Folder${folder}` };
		}
	}
};
