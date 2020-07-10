const pluralize = require('pluralize');
const S = require('String');

module.exports = function(resource, transformedSchema) {
	const capitalizedResource = S(resource).capitalize().s;
	const pluralizedResource = pluralize(resource, 2);
	const pluralizedcapitalizedResource = pluralize(capitalizedResource, 2);
	const target = transformedSchema.options;
	let mutations = `
    "Create a new ${resource}"
    create${capitalizedResource}(data: ${capitalizedResource}Input!): Self${capitalizedResource}Type!

    "Update single ${resource}"
    update${capitalizedResource}(data: ${capitalizedResource}Input!,id: ID!): Self${capitalizedResource}Type!

    "Update multiple ${pluralizedResource}"
    update${pluralizedcapitalizedResource}(data: [${capitalizedResource}Input!],ids: [ID!]!): [Self${capitalizedResource}Type!]!

    "Delete single ${resource}"
    delete${capitalizedResource}(id: ID!): Self${capitalizedResource}Type!

    "Delete multiple ${pluralizedResource}"
    delete${pluralizedcapitalizedResource}(ids: [ID!]): [Self${capitalizedResource}Type!]!
  `;
	if (resource.match(/(quiz|folder)/)) {
		mutations += `
    "Update ${resource} ratings"
    update${capitalizedResource}Ratings(data:RatingsInput!): [RatingsOutput!]!

    "Update ${resource} watch"
    update${capitalizedResource}Watch(ids: [ID!]!): NonNegativeInt!
    `;
	}

	return `extend type Mutation {\n${mutations}\n}`;
};
