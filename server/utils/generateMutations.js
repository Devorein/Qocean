const pluralize = require('pluralize');

module.exports = function(resource) {
	const capitalizedResource = resource.charAt(0).toUpperCase() + resource.substr(1);
	const pluralizedcapitalizedResource = pluralize(capitalizedResource, 2);
	return `
    "Create a new ${resource}"
    create${capitalizedResource}(data: ${capitalizedResource}Input!): Self${capitalizedResource}!

    "Update single ${resource}"
    update${capitalizedResource}(data: ${capitalizedResource}Input!,id: ID!): Self${capitalizedResource}!

    "Update multiple ${pluralize(resource, 2)}"
    update${pluralizedcapitalizedResource}(data: [${capitalizedResource}Input!],ids: [ID!]!): [Self${capitalizedResource}!]!

    "Delete single ${resource}"
    delete${capitalizedResource}(id: ID!): Self${capitalizedResource}!

    "Delete multiple ${pluralize(resource, 2)}"
    delete${pluralizedcapitalizedResource}(ids: [ID!]): [Self${capitalizedResource}!]!
  `;
};
