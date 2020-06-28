import * as userQueries from '../operations/graphql/user';
import pluralize from 'pluralize';

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
				let query = null;
				if (page === 'explore') query = userQueries[`getPaginatedOthers${pluralCapitalizedResource}`];
				queries[`${page}.${resource}.auth`] = query;
			}
			if (auth === 0) {
				let query = null;
				if (page === 'explore') query = userQueries[`getPaginatedMixed${pluralCapitalizedResource}`];
				queries[`${page}.${resource}.unauth`] = query;
			}
		});
	});
	return queries;
}
