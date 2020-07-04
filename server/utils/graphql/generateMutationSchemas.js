const pluralize = require('pluralize');
const S = require('String');

module.exports = function(resource) {
	const capitalizedResource = S(resource).capitalize().s;
	const pluralizedcapitalizedResource = pluralize(capitalizedResource, 2);
	const target = global.Schema[capitalizedResource].options;
	let mutations = `
    "Create a new ${resource}"
    create${capitalizedResource}(data: ${capitalizedResource}Input!): ${target.global_partition.base
		? 'Self'
		: ''}${capitalizedResource}Type!

    "Update single ${resource}"
    update${capitalizedResource}(data: ${capitalizedResource}Input!,id: ID!): ${target.global_partition.base
		? 'Self'
		: ''}${capitalizedResource}Type!

    "Update multiple ${pluralize(resource, 2)}"
    update${pluralizedcapitalizedResource}(data: [${capitalizedResource}Input!],ids: [ID!]!): [${target.global_partition
		.base
		? 'Self'
		: ''}${capitalizedResource}Type!]!

    "Delete single ${resource}"
    delete${capitalizedResource}(id: ID!): ${target.global_partition.base ? 'Self' : ''}${capitalizedResource}Type!

    "Delete multiple ${pluralize(resource, 2)}"
    delete${pluralizedcapitalizedResource}(ids: [ID!]): [${target.global_partition.base
		? 'Self'
		: ''}${capitalizedResource}Type!]!
  `;
	if (resource.match(/(quiz|folder)/)) {
		mutations += `
    "Update ${resource} ratings"
    update${capitalizedResource}Ratings(data:RatingsInput!): [RatingsOutput!]!

    "Update ${resource} watch"
    update${capitalizedResource}Watch(ids: [ID!]!): NonNegativeInt!
    `;
	}

	return mutations;
};
