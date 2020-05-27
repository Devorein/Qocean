import React from 'react';
import axios from 'axios';

class WithSessions extends React.Component {
	state = {
		session: {}
	};
	componentDidMount() {
		this.refetch();
	}
	refetch = () => {
		return axios
			.get('http://localhost:5001/api/v1/users/me', {
				headers: {
					Authorization: `Bearer ${window.localStorage.getItem('token')}`
				}
			})
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
		return this.props.children({ session: this.state.session, refetch: this.refetch });
	}
}

export default WithSessions;
