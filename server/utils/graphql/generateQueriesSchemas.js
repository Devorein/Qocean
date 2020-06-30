const pluralize = require('pluralize');
module.exports = function(resource) {
	const capitalizedResource = pluralize(resource.charAt(0).toUpperCase() + resource.substr(1), 2);
	const res = [];
	[ 'All', 'Paginated', 'Id' ].forEach((sector) => {
		[ 'Mixed', 'Others', 'Self' ].forEach((type) => {
			let datainput = '',
				countinput = '';
			if (sector === 'Paginated') {
				datainput = '(pagination: PaginationInput!)';
				countinput = '(filter: JSON)';
			} else if (sector === 'Id') datainput = '(id: ID!)';
			const commonComment = `"Get ${sector.toLowerCase()} ${type.toLowerCase()} ${resource.toLowerCase()}`;
			if (sector !== 'Id') {
				if (resource !== 'user' || (resource === 'user' && type !== 'Self')) {
					res.push(
						`${commonComment}"\n get${sector}${type}${capitalizedResource}${datainput}: [${type}${resource
							.charAt(0)
							.toUpperCase() + resource.substr(1)}!]!`
					);
					res.push(
						`${commonComment} name and id"\n get${sector}${type}${capitalizedResource}${resource !== 'user'
							? 'Name'
							: 'Username'}${datainput}: [${resource !== 'user' ? 'Name' : 'Username'}AndId!]!`
					);
					res.push(
						`${commonComment} count"\n get${sector === 'Paginated'
							? 'Filtered'
							: sector}${type}${capitalizedResource}Count${countinput}: NonNegativeInt!`
					);
				}
			} else if (resource !== 'user' || (resource === 'user' && type !== 'self')) {
				res.push(
					`${commonComment}"\n get${type}${capitalizedResource}ById${datainput}: [${type}${resource
						.charAt(0)
						.toUpperCase() + resource.substr(1)}!]!`
				);
				res.push(`${commonComment} name and id"\n get${type}${capitalizedResource}NameById${datainput}: [NameAndId!]!`);
			}
		});
	});
	return res.join('\n');
};
