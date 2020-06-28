import * as userQueries from '../operations/graphql/user';
import * as environmentQueries from '../operations/graphql/environment';
import * as questionQueries from '../operations/graphql/question';
import * as quizQueries from '../operations/graphql/quiz';
import * as folderQueries from '../operations/graphql/folder';

import pluralize from 'pluralize';

const resourceQueries = {
	user: userQueries,
	quiz: quizQueries,
	question: questionQueries,
	folder: folderQueries,
	environment: environmentQueries
};

export default function() {
	const pages = [
		{ page: 'explore', resources: [ 'user', 'quiz', 'question', 'folder', 'environment' ], auth: 0 },
		{ page: 'self', resources: [ 'quiz', 'question', 'folder', 'environment' ], auth: 1 },
		{ page: 'play', resources: [ 'quiz', 'folder' ], auth: 1 },
		{ page: 'watchlist', resources: [ 'quiz', 'folder' ], auth: 1 }
	];
	const queries = {};
	pages.forEach((_page) => {
		const { page, resources, auth } = _page;
		resources.forEach((resource) => {
			const pluralCapitalizedResource = pluralize(resource.charAt(0).toUpperCase() + resource.substr(1), 2);
			if (auth === 0 || auth === 1) {
				if (!page.match(/(self|play)/)) {
					queries[`${page}.${resource}.auth.data`] =
						resourceQueries[resource][`getPaginatedOthers${pluralCapitalizedResource}`];
					queries[`${page}.${resource}.auth.count`] =
						resourceQueries[resource][`getFilteredOthers${pluralCapitalizedResource}Count`];
				} else {
					queries[`${page}.${resource}.auth.data`] =
						resourceQueries[resource][`getPaginatedSelf${pluralCapitalizedResource}`];
					queries[`${page}.${resource}.auth.count`] =
						resourceQueries[resource][`getFilteredSelf${pluralCapitalizedResource}Count`];
				}
			}

			if (auth === 0) {
				queries[`${page}.${resource}.unauth.data`] =
					resourceQueries[resource][`getPaginatedMixed${pluralCapitalizedResource}`];
				queries[`${page}.${resource}.unauth.count`] =
					resourceQueries[resource][`getFilteredMixed${pluralCapitalizedResource}Count`];
			}
		});
	});
	return queries;
}
