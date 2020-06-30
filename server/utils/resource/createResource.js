const { createFolderHandler } = require('../../handlers/folder');
const { createQuizHandler } = require('../../handlers/quiz');
const { createQuestionHandler } = require('../../handlers/question');
const { createEnvironmentHandler } = require('../../handlers/environment');

module.exports = async function createResource(model, userId, data) {
	switch (model.modelName) {
		case 'Quiz':
			return await createQuizHandler(userId, data);
		case 'Question':
			return await createQuestionHandler(userId, data);
		case 'Folder':
			return await createFolderHandler(userId, data);
		case 'Environment':
			return await createEnvironmentHandler(userId, data);
		default:
			return null;
	}
};
