const pluralize = require('pluralize');

module.exports = function(resource) {
	const capitalizedResource = resource.charAt(0).toUpperCase() + resource.substr(1);
	const pluralizedcapitalizedResource = pluralize(capitalizedResource, 2);
	let mutations = `
    "Create a new ${resource}"
    create${capitalizedResource}(data: ${capitalizedResource}Input!): Self${capitalizedResource}Type!

    "Update single ${resource}"
    update${capitalizedResource}(data: ${capitalizedResource}Input!,id: ID!): Self${capitalizedResource}Type!

    "Update multiple ${pluralize(resource, 2)}"
    update${pluralizedcapitalizedResource}(data: [${capitalizedResource}Input!],ids: [ID!]!): [Self${capitalizedResource}Type!]!

    "Delete single ${resource}"
    delete${capitalizedResource}(id: ID!): Self${capitalizedResource}Type!

    "Delete multiple ${pluralize(resource, 2)}"
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

	return mutations;
};
