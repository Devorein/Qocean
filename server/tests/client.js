const {
	ApolloClient,
	InMemoryCache,
	createHttpLink
} = require('@apollo/client');
require('cross-fetch/polyfill');

const httpLink = createHttpLink({ uri: 'http://localhost:5002/graphql' });

const client = new ApolloClient({
	link: httpLink,
	cache: new InMemoryCache(),
	onError({ networkError }) {
		if (networkError) console.log('Network error', networkError);
	}
});

module.exports = client;
