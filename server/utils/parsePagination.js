const parseSort = require('./parseSort');
const parsePageLimit = require('./parsePageLimit');

module.exports = function(pagination) {
	const { page, limit, sort, filter } = pagination;
	const parsed_sort = parseSort(sort);
	const [ parsed_page, parsed_limit ] = parsePageLimit(page, limit);
	const parsed_filter = JSON.parse(!filter || filter === '' ? '{}' : filter);
	return { sort: parsed_sort, limit: parsed_limit, page: parsed_page, filter: parsed_filter };
};
