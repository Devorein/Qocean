const { resolvers } = require('graphql-scalars');
const colors = require('colors');

const generateTypedefs = require('./generateTypedefs');
const generateResolvers = require('./generateResolvers');
const populateObjDefaultValue = require('../populateObjDefaultValue');

class Mongql {
	#globalConfigs = {};
	#schemaConfigs = {};

	constructor(options) {
    this.#globalConfigs = {
      ...options,
      Validators: [],
      resources: [],
      schemas: {}
    };
    this.#createDefaultGlobalConfigs();
    
		const {
			Schemas,
			Typedefs: { custom }
    } = options;
    
		Schemas.forEach((schema) => {
			if (schema.mongql === undefined)
				throw new Error(
					colors.red.bold`Resource doesnt have a mongql key on the schema`
				)
			const { resource } = schema.mongql;
			if (resource === undefined)
				throw new Error('Provide the mongoose schema resource type for mongql');
			else this.#globalConfigs.resources.push(resource);
			this.#createDefaultSchemaConfigs(schema);
		})

		Object.entries({ ...resolvers, ...custom }).forEach(([key, value]) => {
			this.#globalConfigs.Validators[key] = value.serialize;
		});

		Object.freeze(this.#globalConfigs);
	}

	getResources = () => this.#globalConfigs.resources;

  #createDefaultGlobalConfigs = ()=>{
    const temp = this.#globalConfigs;
    populateObjDefaultValue(temp,{
      output: false
    });
  }

	#createDefaultSchemaConfigs = (baseSchema) => {
		const { mongql } = baseSchema;

		if (mongql.global_excludePartitions !== undefined) {
			const { base, extra } = mongql.global_excludePartitions;
			mongql.global_excludePartitions = {
				base: base === undefined ? [] : base,
				extra: extra === undefined ? true : extra
			};
		}

		populateObjDefaultValue(mongql, {
			generateInterface: true,
			appendRTypeToEmbedTypesKey: true,
			global_inputs: {
				base: true,
				extra: true
			},
			mutations: {
				create: [true, true],
				delete: [true, true],
				update: [true, true]
			},
			query: {
				all: true,
				paginated: true,
				filtered: true
			},
			output: false,
			global_excludePartitions: {
				base: [],
				extra: true
			}
		});
    
    this.#schemaConfigs[mongql.resource] = mongql;
  };
  
	async generate() {
		const TransformedTypedefs = { obj: {}, arr: [] },
			TransformedResolvers = { obj: {}, arr: [] };
		const {
			Typedefs: {
				init: InitTypedefs,
				transformer: TypedefsTransformer,
				mutation: TypeDefMutationOptions
			},
			Resolvers: { init: InitResolvers, transformer: ResolverTransformer },
			Schemas
    } = this.#globalConfigs;
    for(let i = 0;i<Schemas.length;i++){
      const Schema = Schemas[i];
      const {
        mongql: { generate, resource }
      } = Schema;
      const { typedefsAST, transformedSchema } = generateTypedefs(
        resource,
        Schema,
        generate,
        InitTypedefs[resource],
        TypedefsTransformer,
        TypeDefMutationOptions
      );
  
      TransformedTypedefs.obj[resource] = typedefsAST;
      TransformedTypedefs.arr.push(typedefsAST);
      const resolver = generateResolvers(
        resource,
        generate,
        transformedSchema,
        InitResolvers[resource],
        ResolverTransformer
      );
      TransformedResolvers.obj[resource] = resolver;
      TransformedResolvers.arr.push(resolver);
    }
		return {
			TransformedTypedefs,
			TransformedResolvers
		};
	}
}

module.exports = Mongql;
