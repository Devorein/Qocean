require('@babel/register');

const server = require('../server');

module.exports = async () => {
	global.httpServer = server;
	await global.httpServer.listen();
};
