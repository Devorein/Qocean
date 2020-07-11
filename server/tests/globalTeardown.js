module.exports = async () => {
	await global.GRAPHQL_SERVER.close(() => process.exit(1));
};
