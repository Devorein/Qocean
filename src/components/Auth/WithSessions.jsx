import React from 'react';
import axios from 'axios';

class WithSessions extends React.Component {
	state = {
		session: {}
	};
	componentDidMount() {
		axios
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
				console.log(err.response.data);
				this.setState({
					session: {}
				});
			});
	}
	render() {
		return this.props.children(this.state.session);
	}
}

export default WithSessions;
