const { deleteFolderHandler } = require('../../handlers/folder');
const { deleteQuizHandler } = require('../../handlers/quiz');
const { deleteQuestionHandler } = require('../../handlers/question');
const { deleteEnvironmentHandler } = require('../../handlers/environment');
const { deleteFilterSortHandler } = require('../../handlers/filtersort');

module.exports = async function deleteResource(model, ids, userId) {
	const next = (err) => {
		throw new err();
	};

	const { modelName } = model;

	if (modelName === 'Quiz') return await deleteQuizHandler(ids, userId, next);
	else if (modelName === 'Question') return await deleteQuestionHandler(ids, userId, next);
	else if (modelName === 'Folder') return await deleteFolderHandler(ids, userId, next);
	else if (modelName === 'Environment') return await deleteEnvironmentHandler(ids, userId, next);
	else if (modelName === 'Filtersort') return await deleteFilterSortHandler(ids, userId, next);
};
