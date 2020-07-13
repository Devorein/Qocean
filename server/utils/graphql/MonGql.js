const { resolvers } = require('graphql-scalars');
const colors = require('colors');

const generateTypedefs = require('./generateTypedefs');
const generateResolvers = require('./generateResolvers');

function populateObjDefaultValue(obj, fields) {
	Object.entries(fields).forEach(([ key, value ]) => {
		if (obj[key] === undefined) obj[key] = value;
	});
}

class Mongql {
  #resources = [];
  #Validators = {};

	constructor(options) {
		this.options = options;
		const { Schemas,Typedefs:{custom} } = options;
		Schemas.forEach((schema) => {
      if (schema.mongql === undefined) throw new Error(colors.red.bold`Resource doesnt have a mongql key on the schema`);
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


	#createDefaultConfigs = function(baseSchema) {
		if (!baseSchema.mongql.global_configs) baseSchema.mongql.global_configs = {};
		const { global_configs } = baseSchema.mongql;

		if (global_configs.global_excludePartitions === undefined) {
			global_configs.global_excludePartitions = {
				base: [],
				extra: true
			};
		} else {
			const { base, extra } = global_configs.global_excludePartitions;
			global_configs.global_excludePartitions = {
				base: base === undefined ? [] : base,
				extra: extra === undefined ? true : extra
			};
		}

		populateObjDefaultValue(global_configs, {
			generateInterface: true,
			appendRTypeToEmbedTypesKey: true,
			global_inputs: {
				base: true,
				extra: true
			}
		});

		global_configs.global_inputs = {
			...global_configs.global_inputs
		};
	}

	generate() {
		const TransformedTypedefs = { obj: {}, arr: [] },
    TransformedResolvers = { obj: {}, arr: [] };
    const { Typedefs:{init:InitTypedefs, transformer: TypedefsTransformer,mutation:TypeDefMutationOptions},Resolvers:{init: InitResolvers,transformer: ResolverTransformer},Schemas } = this.options;
		Schemas.forEach((schema) => {
      this.#createDefaultConfigs(schema);
			const { mongql: { generate, resource } } = schema;
			const { typedefsAST, transformedSchema } = generateTypedefs(resource, schema,generate,InitTypedefs[resource],TypedefsTransformer,TypeDefMutationOptions);
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
