import React, { Component } from 'react';
import Color from 'color';
import convert from 'color-convert';
import axios from 'axios';
import { withStyles } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';

class ReportHeader extends Component {
	componentDidMount() {
		const { validations, stats, settings, quizzes } = this.props;
		this.average_time = this.calculateAvg('time_taken');
		this.average_points = this.calculateAvg('points');
		const disabled = {
			type: [],
			difficulty: []
		};
		[ 'MCQ', 'TF', 'MS', 'FC', 'FIB', 'Snippet' ].forEach(
			(type) => (settings[type] ? disabled.type.push(type) : void 0)
		);
		[ 'Beginner', 'Intermediate', 'Advanced' ].forEach(
			(type) => (settings[type] ? disabled.difficulty.push(type) : void 0)
		);

		axios.post(
			'http://localhost:5001/api/v1/reports',
			{
				average_points: this.average_points,
				correct: validations.correct.length,
				incorrect: validations.incorrect.length,
				total: validations.correct.length + validations.incorrect.length,
				name: settings.session_name,
				average_time: this.average_time,
				quizzes,
				disabled,
				questions: stats.map(({ _id, user_answers, time_taken }) => {
					return {
						question: _id,
						user_answers,
						time_taken,
						result: validations.correct.includes(_id)
					};
				})
			},
			{
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			}
		);
	}

	calculateAvg = (field) => {
		const { stats } = this.props;
		let total = 0;
		const totalCount = stats.reduce((statA, statB) => {
			if (statA.add_to_score) total += parseFloat(statA[field]);
			if (statB.add_to_score) total += parseFloat(statB[field]);
			return total;
		});
		const totalStats = stats.filter((stat) => stat.add_to_score).length;
		return (totalCount / totalStats).toFixed(2);
	};

	renderDataRow = () => {
		const { theme, validations } = this.props;
		return (
			<div className="report_header_row report_header_row--validations">
				<div theme={theme} className="report_header_row_item report_header_row_item--correct">
					Correct <span className="text-data">{validations ? validations.correct.length : 0}</span>
				</div>
				<div theme={theme} className="report_header_row_item report_header_row_item--incorrect">
					Incorrect <span className="text-data">{validations ? validations.incorrect.length : 0}</span>
				</div>
				<div theme={theme} className="report_header_row_item report_header_row_item--total">
					Total{' '}
					<span className="text-data">
						{validations ? validations.correct.length + validations.incorrect.length : 0}
					</span>
				</div>
				<div theme={theme} className="report_header_row_item report_header_row_item--points">
					Avg. Points <span className="text-data">{this.calculateAvg('points')}</span>
				</div>
				<div theme={theme} className="report_header_row_item report_header_row_item--time_taken">
					Avg. Timetaken <span className="text-data">{this.calculateAvg('time_taken')}</span>
				</div>
			</div>
		);
	};

	render() {
		const { renderDataRow } = this;
		const { SSFilterSort, classes } = this.props;
		return (
			<div className={`report_header ${classes.root}`}>
				{renderDataRow()}
				{SSFilterSort}
			</div>
		);
	}
}

export default withStyles((theme) => ({
	root: {
		background: Color.rgb(convert.hex.rgb(theme.palette.background.main)).darken(0.25).hex(),

		'& .report_header_row_item': {
			background: Color.rgb(convert.hex.rgb(theme.palette.background.main)).lighten(0.1).hex(),

			'&--correct .text-data': {
				color: theme.palette.success.main
			},

			'&--incorrect .text-data': {
				color: theme.palette.error.main
			},

			'&--total .text-data': {
				color: blue[500]
			}
		}
	}
}))(ReportHeader);
