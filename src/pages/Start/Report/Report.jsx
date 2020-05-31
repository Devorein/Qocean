import React, { Component } from 'react';
import axios from 'axios';
import { withTheme } from '@material-ui/core';

import './Report.scss';
import ReportHeader from './Header/ReportHeader';
import ReportBody from './Body/ReportBody';

class Report extends Component {
	state = {
		responses: []
	};

	componentDidMount() {
		const reductiveDownloadChain = (items) => {
			let responses = [];
			return items.reduce((chain, currentItem) => {
				return chain.then((_) => {
					const { _id } = currentItem;
					axios
						.get(`http://localhost:5001/api/v1/questions/answers/${_id}`, {
							headers: {
								Authorization: `Bearer ${localStorage.getItem('token')}`
							}
						})
						.then((res) => {
							responses.push(res.data.data);
							if (responses.length === items.length) {
								this.setState({
									responses
								});
							}
						});
				});
			}, Promise.resolve());
		};

		reductiveDownloadChain(this.props.stats);
	}

	render() {
		const { theme, stats } = this.props;
		return (
			<div className="report pages">
				<ReportHeader stats={stats} theme={theme} />
				<ReportBody stats={stats} theme={theme} responses={this.state.responses} />
			</div>
		);
	}
}

export default withTheme(Report);
