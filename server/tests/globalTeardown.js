module.exports = async () => {
	console.log('Closing tests');
	global.MONGOD_PROCESS.kill('SIGINT');
	setTimeout(() => {
		global.GRAPHQL_SERVER.close(() => {
			console.log('Closed server');
			process.exit(1);
		});
	}, 10);
};
