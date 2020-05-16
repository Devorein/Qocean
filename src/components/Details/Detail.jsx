import React, { Component } from 'react';
import axios from 'axios';
import './Detail.scss';
class Detail extends Component {
	state = {
		data: []
	};
	componentDidMount() {
		const { type, id } = this.props.match.params;
		axios.get(`http://localhost:5001/api/v1/${type}?_id=${id}`).then((data) => {
			this.setState({
				data
			});
		});
	}
	render() {
		return <div>{}</div>;
	}
}

export default Detail;
