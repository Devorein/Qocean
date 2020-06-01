import React, { Component } from 'react';
import axios from 'axios';
import { withTheme } from '@material-ui/core';

import './Report.scss';
import ReportHeader from './Header/ReportHeader';
import ReportBody from './Body/ReportBody';

class Report extends Component {
	state = {
		validations: null,
		filters: {
			type: 'All',
			result: 'both'
		}
	};

	setFilters = (target, value) => {
		this.setState({
			filters: {
				...this.state.filters,
				[target]: value
			}
		});
	};

	componentDidMount() {
		const questions = this.props.stats.map((stat) => ({ id: stat._id, answers: stat.user_answers }));
		axios
			.put(
				'http://localhost:5001/api/v1/questions/_/validations',
				{ questions },
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				}
			)
			.then(({ data: { data: validations } }) => {
				this.setState({
					validations
				});
			});
	}

	render() {
		const { theme, stats } = this.props;
		const { validations } = this.state;
		return (
			<div className="report pages">
				<ReportHeader
					stats={stats}
					theme={theme}
					validations={validations}
					setFilters={this.setFilters}
					filters={this.state.filters}
				/>
				<ReportBody stats={stats} theme={theme} filters={this.state.filters} validations={validations} />
			</div>
		);
	}
}

export default withTheme(Report);
