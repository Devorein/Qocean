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
		}
	}
};
