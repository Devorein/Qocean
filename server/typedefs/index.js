const { typeDefs: ExternalTypedefs } = require('graphql-scalars');
const { gql } = require('apollo-server-express');

const generateQueries = require('../utils/graphql/generateQueryTypedefs');
const generateMutations = require('../utils/graphql/generateMutationTypedefs');
const generateTypeTypedef = require('../utils/graphql/generateTypeTypedefs');

const typedefs = {};

function addTypeDefs(typedef, typeTypeDefs) {
	typedef.definitions.unshift(...gql`${typeTypeDefs}`.definitions);
}

function addQueryDefs(typedefs, queryTypeDefs) {
	const queryObjTypeExtension = typedefs.definitions.find((typedef) => {
		return typedef.kind === 'ObjectTypeExtension' && typedef.name.value === 'Query';
	});
	if (queryObjTypeExtension) queryObjTypeExtension.fields.push(...gql`${queryTypeDefs}`.definitions[0].fields);
	else typedefs.definitions.push(gql`${queryTypeDefs}`);
}

function addMutationDefs(typedefs, queryTypeDefs) {
	const mutationObjTypeExtension = typedefs.definitions.find((typedef) => {
		return typedef.kind === 'ObjectTypeExtension' && typedef.name.value === 'Mutation';
	});
	if (mutationObjTypeExtension) mutationObjTypeExtension.fields.push(...gql`${queryTypeDefs}`.definitions[0].fields);
	else typedefs.definitions.push(gql`${queryTypeDefs}`);
}

function transformTypeDefs(typedef, generate, resource) {
	if (generate !== false) {
		if (generate === true)
			generate = {
				type: true,
				query: true,
				mutation: true
			};
		const { type = false, query = false, mutation = false } = generate;
		if (type) addTypeDefs(typedef, generateTypeTypedef(resource));
		if (query) addQueryDefs(typedef, generateQueries(resource));
		if (mutation) addMutationDefs(typedef, generateMutations(resource));
		return typedef;
	} else return typedef;
}

(() => {
	[
		'Base',
		'Auth',
		'User',
		'Quiz',
		'Question',
		'Folder',
		'Environment',
		'Watchlist',
		'Filtersort',
		'Report',
		'Inbox',
		'Message'
	].forEach((resource) => {
		let { typedef, generate } = require(`./${resource}.js`);
		if (typedef === null)
			typedef = {
				kind: 'Document',
				definitions: []
			};
		typedefs[resource] = transformTypeDefs(typedef, generate, resource.toLowerCase());
	});
})();

typedefs.External = ExternalTypedefs;

module.exports = typedefs;
