import React, { Component } from 'react';
import axios from 'axios';

class UserDetails extends Component {
	state = {
		data: []
	};
	componentDidMount() {
		const { userId } = this.props.match.params;
		axios.get(`http://localhost:5001/api/v1/users?_id=${userId}`).then((data) => {
			console.log(data);
		});
	}
	render() {
		return <div>User Details</div>;
	}
}

export default UserDetails;
