import React from 'react';
import axios from 'axios';
import { Query } from '@apollo/react-components';
import { getSelfUser } from '../../operations/graphql/user';

class WithSessions extends React.Component {
	state = {
		session: {}
	};
	componentDidMount() {
		this.refetch();
	}
	refetch = () => {
		return axios
			.get(
				'http://localhost:5001/api/v1/users/me?populate=watchlist,current_environment&populateFields=watched_folders,watched_quizzes-',
				{
					headers: {
						Authorization: `Bearer ${window.localStorage.getItem('token')}`
					}
				}
			)
			.then((session) => {
				this.setState({
					session
				});
			})
			.catch((err) => {
				console.log(err.response);
				this.setState({
					session: {}
				});
			});
	};
	render() {
		return (
			<Query query={getSelfUser}>
				{({ loading, error, data }) => {
					console.log(data);
					return this.props.children({
						session: this.state.session,
						refetch: this.refetch,
						updateUserLocally: (user) => {
							const { session } = this.state;
							session.data.user = user;
							this.setState({
								session
							});
						}
					});
				}}
			</Query>
		);
	}
}

export default WithSessions;
