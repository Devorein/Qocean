module.exports = () => {
	console.log('Closing tests');
	// global.GRAPHQL_SERVER.close(() => {
	// 	console.log('Closed server');
	// });
	process.exit(1);
};
