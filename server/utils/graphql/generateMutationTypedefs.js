const pluralize = require('pluralize');
const S = require('String');

module.exports = function(resource, transformedSchema, TypedefsMutationTransformers) {
	const capitalizedResource = S(resource).capitalize().s;
	const pluralizedResource = pluralize(resource, 2);
	const pluralizedcapitalizedResource = pluralize(capitalizedResource, 2);

	const { mongql: { mutations } } = transformedSchema;

	let mutationsStr = ``;
	if (mutations.create[0])
		mutationsStr += `
    "Create a new ${resource}"
    create${capitalizedResource}(data: ${capitalizedResource}Input!): Self${capitalizedResource}Type!
  `;

	if (mutations.update[0])
		mutationsStr += `
    "Update single ${resource}"
    update${capitalizedResource}(data: ${capitalizedResource}Input!,id: ID!): Self${capitalizedResource}Type!
  `;

	if (mutations.update[1])
		mutationsStr += `
    "Update multiple ${pluralizedResource}"
    update${pluralizedcapitalizedResource}(data: [${capitalizedResource}Input!],ids: [ID!]!): [Self${capitalizedResource}Type!]!
  `;

	if (mutations.delete[0])
		mutationsStr += `
    "Delete single ${resource}"
    delete${capitalizedResource}(id: ID!): Self${capitalizedResource}Type!
  `;

	if (mutations.delete[1])
		mutationsStr += `
    "Delete multiple ${pluralizedResource}"
    delete${pluralizedcapitalizedResource}(ids: [ID!]): [Self${capitalizedResource}Type!]!
  `;
	if (TypedefsMutationTransformers) mutationsStr += TypedefsMutationTransformers(resource, capitalizedResource);
	return `extend type Mutation {\n${mutationsStr}\n}`;
};
