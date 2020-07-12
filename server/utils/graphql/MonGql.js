const generateTypedefs = require('./generateTypedefs');
const generateResolvers = require('../../resolvers');

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
	generate(typedefsASTs) {
		const TransformedTypedefs = { obj: {}, arr: [] },
    TransformedResolvers = { obj: {}, arr: [] };
		const { Schemas } = this.options;
		Schemas.forEach((schema) => {
			const { mongql: { generate, resource } } = schema;
			const { typedefsAST, transformedSchema } = generateTypedefs(resource, generate,typedefsASTs[resource]);
			TransformedTypedefs.obj[resource] = typedefsAST;
			TransformedTypedefs.arr.push(typedefsAST);
			const resolver = generateResolvers(resource, generate, transformedSchema);
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
