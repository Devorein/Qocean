const pluralize = require('pluralize');

const createResource = require('../resource/createResource');
const updateResource = require('../resource/updateResource');
const deleteResource = require('../resource/deleteResource');

module.exports = function(resource, transformedSchema, MutationResolversTransformers) {
	const pluralizedResource = pluralize(resource, 2);
	const capitalizedResource = resource.charAt(0).toUpperCase() + resource.substr(1);
	const pluralizedcapitalizedResource = pluralize(capitalizedResource, 2);

	const { mongql } = transformedSchema;
	console.log(mongql.mutations);

	const MutationResolvers = {
		[`create${capitalizedResource}`]: async function(parent, { data }, ctx) {
			return await createResource(ctx[capitalizedResource], ctx.user.id, data);
		},
		[`update${capitalizedResource}`]: async function(parent, { data, id }, ctx) {
			data.id = id;
			return (await updateResource(ctx[capitalizedResource], [ data ], ctx.user.id, (err) => {
				throw err;
			}))[0];
		},

		[`update${pluralizedcapitalizedResource}`]: async function(parent, { data, ids }, ctx) {
			ids.forEach((id, i) => (data[i].id = id));
			return await updateResource(ctx[capitalizedResource], data, ctx.user.id, (err) => {
				throw err;
			});
		},
		[`delete${capitalizedResource}`]: async function(parent, { id }, ctx) {
			return (await deleteResource(ctx[capitalizedResource], [ id ], ctx.user.id))[0];
		},
		[`delete${pluralizedcapitalizedResource}`]: async function(parent, { ids }, ctx) {
			return await deleteResource(ctx[capitalizedResource], ids, ctx.user.id);
		}
	};
	let extraResolvers = {};
	if (MutationResolversTransformers)
		extraResolvers = MutationResolversTransformers(resource, {
			capitalized: capitalizedResource,
			pluralized: pluralizedResource
		});
	extraResolvers = extraResolvers !== undefined ? extraResolvers : {};
	Object.entries(extraResolvers).forEach(([ key, resolver ]) => {
		MutationResolvers[key] = resolver;
	});

	return MutationResolvers;
};
