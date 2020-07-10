const S = require('string');
const { typeDefs: ExternalTypeDef, resolvers: ExternalResolvers } = require('graphql-scalars');

const modelschema = require('./models');
const generateTypedefs = require('./typedefs');
const generateResolvers = require('./resolvers');
const routes = require('./routes');

const AuthTypedef = require('./typedefs/Auth');
const AuthResolvers = require('./resolvers/auth');

const BaseTypedef = require('./typedefs/Base');
const BaseResolvers = require('./resolvers/base');

const ModelsArr = [];
const ModelsObj = {};
const SchemasArr = [];
const SchemasObj = {};
const TypedefsArr = [];
const TypedefsObj = {};
const ResolversArr = [];
const ResolversObj = {};

[
	[ 'Auth', AuthTypedef, AuthResolvers ],
	[ 'Base', BaseTypedef, BaseResolvers ],
	[ 'External', ExternalTypeDef, ExternalResolvers ]
].forEach(([ key, typedef, resolver ]) => {
	TypedefsObj[key] = typedef;
	if (Array.isArray(typedef)) TypedefsArr.push(...typedef);
	else TypedefsArr.push(typedef);
	ResolversObj[key] = resolver;
	ResolversArr.push(resolver);
});

Object.entries(modelschema).forEach(([ resource, [ model, schema ] ]) => {
	ModelsObj[S(resource).capitalize().s] = model;
	ModelsArr.push(model);
	SchemasObj[S(resource).capitalize().s] = schema;
	SchemasArr.push(schema);

	const { mongql: { generate } } = schema;

	const { typedefsAST, transformedSchema } = generateTypedefs(resource, generate);
	TypedefsObj[resource] = typedefsAST;
	TypedefsArr.push(typedefsAST);
	const resolver = generateResolvers(resource, generate, transformedSchema);
	ResolversObj[resource] = resolver;
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
		obj: TypedefsObj,
		arr: TypedefsArr
	},
	Resolvers: {
		obj: ResolversObj,
		arr: ResolversArr
	},
	Routes: {
		obj: routes,
		arr: RoutesArr
	}
};
