const S = require('string');
const { typeDefs: ExternalTypeDef, resolvers: ExternalResolvers } = require('graphql-scalars');
const Mongql = require('./utils/graphql/MonGql');

const modelschema = require('./models');

const routes = require('./routes');

const AuthTypedef = require('./typedefs/Auth');
const AuthResolvers = require('./resolvers/auth');

const BaseTypedef = require('./typedefs/Base');
const BaseResolvers = require('./resolvers/base');

const PreTransformedTypeDefsASTs = require('./typedefs');
const PreTransformedResolvers = require('./resolvers');

const ModelsArr = [];
const ModelsObj = {};
const SchemasArr = [];
const SchemasObj = {};

Object.entries(modelschema).forEach(([ resource, [ model, schema ] ]) => {
	ModelsObj[S(resource).capitalize().s] = model;
	ModelsArr.push(model);
	SchemasObj[S(resource).capitalize().s] = schema;
	SchemasArr.push(schema);
});

const mongql = new Mongql({
	Schemas: SchemasArr,
	Typedefs: PreTransformedTypeDefsASTs,
	Resolvers: PreTransformedResolvers
});

const { TransformedResolvers, TransformedTypedefs } = mongql.generate();

const TypedefsArr = TransformedTypedefs.arr;
const TypedefsObj = TransformedTypedefs.obj;
const ResolversArr = TransformedResolvers.arr;
const ResolversObj = TransformedResolvers.obj;

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
