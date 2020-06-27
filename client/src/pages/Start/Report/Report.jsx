import React, { Component } from 'react';
import axios from 'axios';
import { withTheme } from '@material-ui/core';

import './Report.scss';
import ReportHeader from './Header/ReportHeader';
import ReportBody from './Body/ReportBody';
import SSFilterSort from '../../../components/FilterSort/SSFilterSort';

class Report extends Component {
	state = {
		validations: null
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

	transformStats = () => {
		const { stats } = this.props;
		return stats.map((stat) => {
			if (!stat.add_to_score) stat.points = 0;
			else {
				const { time_allocated, time_taken } = stat;
				stat.points = parseFloat((time_allocated - time_taken) * 100 / time_allocated / 10).toFixed(2);
			}
			return stat;
		});
	};

	render() {
		const { theme, settings, quizzes } = this.props;

		const stats = this.transformStats();
		const { validations } = this.state;
		const props = {
			stats,
			theme,
			validations,
			settings,
			quizzes
		};
		return validations ? (
			<div className="report pages">
				<SSFilterSort
					type={'Question'}
					page={'Report'}
					onApply={(e) => {
						console.log(e);
					}}
				>
					{({ SSFilterSort, filter_sort }) => {
						return (
							<div>
								<ReportHeader {...props} SSFilterSort={SSFilterSort} />
								<ReportBody {...props} />
							</div>
						);
					}}
				</SSFilterSort>
			</div>
		) : null;
	}
}

export default withTheme(Report);
