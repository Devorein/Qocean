import React, { Component } from 'react';
import axios from 'axios';
import { withStyles } from '@material-ui/core';

import ReportBodyItemHeader from './Item/Header/ReportBodyItemHeader';
import ReportBodyItemBody from './Item/Body/ReportBodyItemBody';

class ReportBody extends Component {
	state = {
		answers: null
	};
	componentDidMount() {
		if (this.props.stats) {
			const questions = this.props.stats.map(({ _id }) => _id);
			axios
				.put(
					'http://localhost:5001/api/v1/questions/_/answers',
					{
						questions
					},
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem('token')}`
						}
					}
				)
				.then(({ data: { data: answers } }) => {
					this.setState({
						answers
					});
				});
		}
	}

	applyFilters = () => {
		const { stats, validations } = this.props;
		const { answers } = this.state;
		return stats.map((stat, index) => {
			return (
				<div className="report_body_item" key={stat._id}>
					<ReportBodyItemHeader stat={stat} answer={answers[index]} validations={validations} />
					<ReportBodyItemBody stat={stat} answer={answers[index]} random={this.props.settings.randomized_options} />
				</div>
			);
		});
	};

	render() {
		const { answers } = this.state;
		return <div className={`report_body ${this.props.classes.root}`}>{answers ? this.applyFilters() : null}</div>;
	}
}

export default withStyles((theme) => ({
	root: {
		'& .report_body_item': {
			backgroundColor: theme.darken(theme.palette.background.main, 0.1)
		}
	}
}))(ReportBody);
