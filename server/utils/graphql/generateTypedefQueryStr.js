const pluralize = require('pluralize');

module.exports = function(resource) {
	const cResource = resource.charAt(0).toUpperCase() + resource.substr(1);
	const cpResource = pluralize(cResource, 2);
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
					res.push(`${commonComment}"\n get${sector}${type}${cpResource}${datainput}: [${type}${cResource}Type!]!`);
					res.push(
						`${commonComment} name and id"\n get${sector}${type}${cpResource}${resource !== 'user'
							? 'Name'
							: 'Username'}${datainput}: [${resource !== 'user' ? 'Name' : 'Username'}AndId!]!`
					);
					res.push(
						`${commonComment} count"\n get${sector === 'Paginated'
							? 'Filtered'
							: sector}${type}${cpResource}Count${countinput}: NonNegativeInt!`
					);
				}
			} else if (resource !== 'user' || (resource === 'user' && type !== 'self')) {
				res.push(`${commonComment}"\n get${type}${cpResource}ById${datainput}: [${type}${cResource}Type!]!`);
				res.push(`${commonComment} name and id"\n get${type}${cpResource}NameById${datainput}: [NameAndId!]!`);
			}
		});
	});
	return `extend type Query {\n${res.join('\n')}\n}`;
};
