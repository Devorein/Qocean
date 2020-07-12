const generateTypedefs = require('../../typedefs');
const generateResolvers = require('../../resolvers');

class Mongql {
	constructor(options) {
		this.options = options;
	}

	generate() {
		const Typedefs = { obj: {}, arr: [] },
			Resolvers = { obj: {}, arr: [] };
		const { Schemas } = this.options;
		Schemas.forEach((schema) => {
			const { mongql: { generate, resource } } = schema;
			const { typedefsAST, transformedSchema } = generateTypedefs(resource, generate);
			Typedefs.obj[resource] = typedefsAST;
			Typedefs.arr.push(typedefsAST);
			const resolver = generateResolvers(resource, generate, transformedSchema);
			Resolvers.obj[resource] = resolver;
			Resolvers.arr.push(resolver);
		});
		return {
			Typedefs,
			Resolvers
		};
	}
}

module.exports = Mongql;
