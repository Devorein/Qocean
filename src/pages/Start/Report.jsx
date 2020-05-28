import React, { Component } from 'react';
import axios from 'axios';

class Report extends Component {
	state = {};

	componentDidMount() {
		let current = 0;
		let done = false;
		function reductiveDownloadChain(items) {
			const responses = [];
			return items.reduce((chain, currentItem) => {
				return chain.then((_) => {
					current++;
					const { _id } = currentItem;
					axios
						.get(`http://localhost:5001/api/v1/questions/answers/${_id}`, {
							headers: {
								Authorization: `Bearer ${localStorage.getItem('token')}`
							}
						})
						.then((res) => {
							responses.push(res);
							if (current === items.length && !done) {
								console.log(responses);
								done = true;
							}
						});
				});
			}, Promise.resolve());
		}

		reductiveDownloadChain(this.props.stats);
	}
	render() {
		return <div>Report page</div>;
	}
}

export default Report;
