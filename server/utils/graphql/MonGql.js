const { resolvers } = require('graphql-scalars');

const generateTypedefs = require('./generateTypedefs');
const generateResolvers = require('./generateResolvers');

class Mongql {
  #resources = [];
  #Validators = {};

	constructor(options) {
		this.options = options;
		const { Schemas,Typedefs:{custom} } = options;
		Schemas.forEach((schema) => {
			const { resource } = schema.mongql;
			if (resource === undefined) throw new Error('Provide the mongoose schema resource type for mongql');
			else this.#resources.push(resource);
    });

    Object.entries({...resolvers,...custom}).forEach(([ key, value ]) => {
      this.#Validators[key] = value.serialize;
    });

    Object.freeze(this.#Validators);
	}

  getResources = () => this.#resources;
	generate() {
		const TransformedTypedefs = { obj: {}, arr: [] },
    TransformedResolvers = { obj: {}, arr: [] };
    const { Typedefs:{init:InitTypedefs, transformer: TypedefsTransformer,mutation:TypeDefMutationOptions},Resolvers:{init: InitResolvers,transformer: ResolverTransformer},Schemas } = this.options;
		Schemas.forEach((schema) => {
			const { mongql: { generate, resource } } = schema;
			const { typedefsAST, transformedSchema } = generateTypedefs(resource, generate,InitTypedefs[resource],TypedefsTransformer,TypeDefMutationOptions);
			TransformedTypedefs.obj[resource] = typedefsAST;
			TransformedTypedefs.arr.push(typedefsAST);
			const resolver = generateResolvers(resource, generate, transformedSchema,InitResolvers[resource],ResolverTransformer);
			TransformedResolvers.obj[resource] = resolver;
			TransformedResolvers.arr.push(resolver);
		});
		return {
			TransformedTypedefs,
			TransformedResolvers
		};
	}
}

module.exports = Mongql;
