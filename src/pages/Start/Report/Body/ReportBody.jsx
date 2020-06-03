import React, { Component } from 'react';
import Color from 'color';
import convert from 'color-convert';
import styled from 'styled-components';
import axios from 'axios';

import ReportBodyItemHeader from './Item/Header/ReportBodyItemHeader';
import ReportBodyItemBody from './Item/Body/ReportBodyItemBody';

const ReportBodyC = styled.div`
	& .report_body_item {
		background: ${(props) => Color.rgb(convert.hex.rgb(props.theme.palette.background.main)).darken(0.1).hex()};
	}
`;

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
		const { filters, stats, validations } = this.props;
		const { answers } = this.state;

		return stats
			.filter((stat) => {
				if (filters.result === 'both') return stat;
				else return validations[filters.result].includes(stat._id);
			})
			.filter((stat) => filters.type === 'All' || stat.type === filters.type)
			.map((stat, index) => {
				return (
					<div className="report_body_item" key={stat._id}>
						<ReportBodyItemHeader stat={stat} answer={answers[index]} validations={validations} />
						<ReportBodyItemBody stat={stat} answer={answers[index]} random={this.props.settings.randomized_options} />
					</div>
				);
			});
	};
	render() {
		const { theme } = this.props;
		const { answers } = this.state;
		return (
			<ReportBodyC className={'report_body'} theme={theme}>
				{answers ? this.applyFilters() : null}
			</ReportBodyC>
		);
	}
}

export default ReportBody;
