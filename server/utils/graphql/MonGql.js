const generateTypedefs = require('./generateTypedefs');
const generateResolvers = require('./generateResolvers');

class Mongql {
  #resources = [];

	constructor(options) {
		this.options = options;
		const { Schemas } = options;
		Schemas.forEach((schema) => {
			const { resource } = schema.mongql;
			if (resource === undefined) throw new Error('Provide the mongoose schema resource type for mongql');
			else this.#resources.push(resource);
		});
	}

  getResources = () => this.#resources;
	generate() {
		const TransformedTypedefs = { obj: {}, arr: [] },
    TransformedResolvers = { obj: {}, arr: [] };
    const { Typedefs,Resolvers,Schemas } = this.options;
		Schemas.forEach((schema) => {
			const { mongql: { generate, resource } } = schema;
			const { typedefsAST, transformedSchema } = generateTypedefs(resource, generate,Typedefs[resource]);
			TransformedTypedefs.obj[resource] = typedefsAST;
			TransformedTypedefs.arr.push(typedefsAST);
			const resolver = generateResolvers(resource, generate, transformedSchema,Resolvers[resource]);
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
