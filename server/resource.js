const S = require('string');

const modelschema = require('./models');
const typedefs = require('./typedefs');
const resolvers = require('./resolvers');
const routes = require('./routes');

const ModelsArr = [];
const ModelsObj = {};
const SchemasArr = [];
const SchemasObj = {};

Object.entries(modelschema).forEach(([ key, [ model, schema ] ]) => {
	ModelsObj[S(key).capitalize().s] = model;
	ModelsArr.push(model);
	SchemasObj[S(key).capitalize().s] = schema;
	SchemasArr.push(schema);
});

const TypedefsArr = [];
Object.values(typedefs).forEach((typedef) => {
	if (Array.isArray(typedef)) TypedefsArr.push(...typedef);
	else TypedefsArr.push(typedef);
});

const ResolversArr = [];
Object.values(resolvers).forEach((resolver) => {
	ResolversArr.push(resolver);
});

const RoutesArr = [];
Object.values(routes).forEach((route) => {
	RoutesArr.push(route);
});

module.exports = {
	Models: {
		obj: ModelsObj,
		arr: ModelsArr
	},
	Schemas: {
		obj: SchemasObj,
		arr: SchemasArr
	},
	Typedefs: {
		obj: typedefs,
		arr: TypedefsArr
	},
	Resolvers: {
		obj: resolvers,
		arr: ResolversArr
	},
	Routes: {
		obj: routes,
		arr: RoutesArr
	}
};
