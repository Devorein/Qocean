export const SET_PAGE_QUERIES = 'SET_PAGE_QUERIES';

export function setPageQueries(pageQueries) {
	return {
		type: SET_PAGE_QUERIES,
		pageQueries
	};
}
