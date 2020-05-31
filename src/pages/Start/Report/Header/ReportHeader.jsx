import React, { Component } from 'react';
import Color from 'color';
import convert from 'color-convert';
import styled from 'styled-components';
import { blue } from '@material-ui/core/colors';
import InputSelect from '../../../../components/Input/InputSelect';

const ReportHeaderC = styled.div`
	background: ${(props) => Color.rgb(convert.hex.rgb(props.theme.palette.background.main)).darken(0.25).hex()};

	& .report_header_row_item {
		background: ${(props) => Color.rgb(convert.hex.rgb(props.theme.palette.background.main)).lighten(0.1).hex()};

		&--correct .text-data {
			color: ${(props) => props.theme.palette.success.main};
		}

		&--incorrect .text-data {
			color: ${(props) => props.theme.palette.error.main};
		}

		&--total .text-data {
			color: ${blue[500]};
		}
	}
`;

class ReportHeader extends Component {
	state = {
		filters: {
			type: 'All',
			result: 'both'
		}
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
			</div>
		);
	};
	renderFilterRow = () => {
		return (
			<div className="report_header_row report_header_row--filter">
				<InputSelect
					className="report_header_row--filter report_header_row_item report_header_row--filter--result"
					selectItems={[
						{ text: 'Show both', value: 'both' },
						{ text: 'Show only correct', value: 'correct' },
						{ text: 'Show only incorrect', value: 'incorrect' }
					]}
					name="Filter By validaiton"
					value={this.state.filters.result}
					onChange={(e) => {
						this.setState({
							filters: {
								...this.state.filters,
								result: e.target.value
							}
						});
					}}
				/>
				<InputSelect
					className="report_header_row--filter report_header_row_item report_header_row--filter--type"
					selectItems={[
						{ value: 'All', text: 'All types' },
						{ value: 'MCQ', text: 'Multiple Choice Question' },
						{ value: 'MS', text: 'Multi Select' },
						{ value: 'FIB', text: 'Fill In The Blanks' },
						{ value: 'FC', text: 'Flashcard' },
						{ value: 'Snippet', text: 'Snippet' },
						{ value: 'TF', text: 'True/False' }
					]}
					name="Filter By type"
					value={this.state.filters.type}
					onChange={(e) => {
						this.setState({
							filters: {
								...this.state.filters,
								type: e.target.value
							}
						});
					}}
				/>
			</div>
		);
	};
	render() {
		const { renderDataRow, renderFilterRow } = this;
		const { theme } = this.props;
		return (
			<ReportHeaderC theme={theme} className="report_header">
				{renderDataRow()}
				{renderFilterRow()}
			</ReportHeaderC>
		);
	}
}

export default ReportHeader;
