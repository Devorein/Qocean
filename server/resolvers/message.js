const generateTypeResolvers = require('../utils/graphql/generateTypeResolvers');

module.exports = {
	...generateTypeResolvers('message')
};
