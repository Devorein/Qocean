const { deleteFolderHandler } = require('../../handlers/folder');
const { deleteQuizHandler } = require('../../handlers/quiz');
const { deleteQuestionHandler } = require('../../handlers/question');
const { deleteEnvironmentHandler } = require('../../handlers/environment');

module.exports = async function deleteResource(model, ids, userId) {
	const next = (err) => {
		throw new err();
	};

	switch (model.modelName) {
		case 'Quiz':
			return await deleteQuizHandler(ids, userId, next);
		case 'Question':
			return await deleteQuestionHandler(ids, userId, next);
		case 'Folder':
			return await deleteFolderHandler(ids, userId, next);
		case 'Environment':
			return await deleteEnvironmentHandler(ids, userId, next);
		default:
			return null;
	}
};
