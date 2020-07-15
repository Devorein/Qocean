const { createFolderHandler } = require('../../handlers/folder');
const { createQuizHandler } = require('../../handlers/quiz');
const { createQuestionHandler } = require('../../handlers/question');
const { createEnvironmentHandler } = require('../../handlers/environment');

module.exports = async function createResource(model, userId, data) {
	const next = (err) => {
		throw err;
	};
	const { modelName } = model;

	if (modelName === 'Quiz') return await createQuizHandler(userId, data, next);
	else if (modelName === 'Question')
		return await createQuestionHandler(userId, data, next);
	else if (modelName === 'Folder')
		return await createFolderHandler(userId, data, next);
	else if (modelName === 'Environment')
		return await createEnvironmentHandler(userId, data, next);
	else if (modelName === 'Filtersort') {
		data.user = userId;
		return await model.create(data);
	}
};
