const pluralize = require('pluralize');
const S = require('string');

module.exports = function (resource) {
	const cResource = S(resource).capitalize().s;
	const cpResource = pluralize(cResource, 2);
	const res = [];
	['All', 'Paginated', 'Filtered', 'Id'].forEach((range) => {
		['Mixed', 'Others', 'Self'].forEach((auth) => {
			const parts = range.match(/(Id|Paginated)/)
				? ['Whole', 'NameAndId']
				: ['Whole', 'NameAndId', 'Count'];
			parts.forEach((part) => {
				let input = '',
					output = `[${auth}${cResource}Type!]!`;
				if (range === 'Paginated') {
					input = '(pagination: PaginationInput!)';
					if (part === 'NameAndId') output = '[NameAndId!]!';
				} else if (range === 'Filtered') {
					input = '(filter: JSON)';
					if (part === 'NameAndId') output = '[NameAndId!]!';
				} else if (range === 'Id') {
					input = '(id: ID!)';
					output = `${auth}${cResource}Type!`;
					if (part === 'NameAndId') output = 'NameAndId!';
				}
				if (part === 'Count') output = 'NonNegativeInt!';
				const commonComment = `"Get ${range.toLowerCase()} ${auth.toLowerCase()} ${resource.toLowerCase()} ${part.toLowerCase()}`;
				res.push(
					`${commonComment}"\n get${range}${auth}${cpResource}${part}${input}: ${output}`
				);
			});
		});
	});
	return `extend type Query {\n${res.join('\n')}\n}`;
};
