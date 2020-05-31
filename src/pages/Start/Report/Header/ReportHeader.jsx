import React, { Component } from 'react';
import Color from 'color';
import convert from 'color-convert';
import styled from 'styled-components';
import axios from 'axios';
import { blue } from '@material-ui/core/colors';

const ReportHeaderC = styled.div`
	background: ${(props) => Color.rgb(convert.hex.rgb(props.theme.palette.background.main)).darken(0.25).hex()};
`;

const background = `background: ${(props) =>
	Color.rgb(convert.hex.rgb(props.theme.palette.background.main)).lighten(0.1).hex()}`;

const Correct = styled.div`
	${background};
	& .text-data {
		color: ${(props) => props.theme.palette.success.main};
	}
`;

const Incorrect = styled.div`
	${background};
	& .text-data {
		color: ${(props) => props.theme.palette.error.main};
	}
`;

const Total = styled.div`
	${background};
	& .text-data {
		color: ${(props) => blue[500]};
	}
`;

class ReportHeader extends Component {
	state = {
		data: null
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
			.then(({ data: { data } }) => {
				this.setState({
					data
				});
			});
	}
	render() {
		const { theme } = this.props;
		const { data } = this.state;
		return (
			<ReportHeaderC theme={theme} className="report_header">
				<Correct theme={theme} className="report_header_item report_header_item--correct">
					Correct <span className="text-data">{data ? data.correct : 0}</span>
				</Correct>
				<Incorrect theme={theme} className="report_header_item report_header_item--incorrect">
					Incorrect <span className="text-data">{data ? data.incorrect : 0}</span>
				</Incorrect>
				<Total theme={theme} className="report_header_item report_header_item--total">
					Total <span className="text-data">{data ? data.correct + data.incorrect : 0}</span>
				</Total>
			</ReportHeaderC>
		);
	}
}

export default ReportHeader;
