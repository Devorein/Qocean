import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/link-context';
const httpLink = createHttpLink({ uri: 'http://localhost:5002/graphql' });

const authLink = setContext((_, { headers }) => {
	const token = localStorage.getItem('token');
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : ''
		}
	};
});

const cache = new InMemoryCache();
const client = new ApolloClient({
	cache,
	link: authLink.concat(httpLink),
	onError ({ networkError }) {
		if (networkError) console.log('Network error', networkError);
	}
});

export default client;

export { cache };
