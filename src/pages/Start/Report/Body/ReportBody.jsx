import React, { Component } from 'react';
import Color from 'color';
import convert from 'color-convert';
import styled from 'styled-components';
import axios from 'axios';

import ReportBodyItemHeader from './Item/Header/ReportBodyItemHeader';
import ReportBodyItemBody from './Item/Body/ReportBodyItemBody';

const ReportBodyC = styled.div`/* background: ${(props) => props.theme.palette.background.main}; */`;
const ReportBodyItem = styled.div`
	margin: 5px;
	background: ${(props) => Color.rgb(convert.hex.rgb(props.theme.palette.background.main)).darken(0.1).hex()};
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
	render() {
		const { theme, stats, validations } = this.props;
		const { answers } = this.state;
		return (
			<ReportBodyC className={'report_body'} theme={theme}>
				{answers ? (
					answers.map((answer, index) => {
						return (
							<ReportBodyItem className="report_body_item" theme={theme} key={stats[index]._id}>
								<ReportBodyItemHeader stat={stats[index]} answer={answer} validations={validations} />
								{/* <ReportBodyItemBody stat={stats[index]} response={response} /> */}
							</ReportBodyItem>
						);
					})
				) : null}
			</ReportBodyC>
		);
	}
}

export default ReportBody;
