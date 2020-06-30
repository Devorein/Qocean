const { createFolderHandler } = require('../../handlers/folder');
const { createQuizHandler } = require('../../handlers/quiz');
const { createQuestionHandler } = require('../../handlers/question');
const { createEnvironmentHandler } = require('../../handlers/environment');

module.exports = async function createResource(model, userId, data) {
	const next = (err) => {
		throw new err();
	};
	switch (model.modelName) {
		case 'Quiz':
			return await createQuizHandler(userId, data, next);
		case 'Question':
			return await createQuestionHandler(userId, data, next);
		case 'Folder':
			return await createFolderHandler(userId, data, next);
		case 'Environment':
			return await createEnvironmentHandler(userId, data, next);
		default:
			return null;
	}
};
