import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { withTheme } from '@material-ui/core';
import ReportBodyItemHeader from './Item/Header/ReportBodyItemHeader';
import ReportBodyItemBody from './Item/Body/ReportBodyItemBody';
import './Report.scss';

const ReportBody = styled.div`/* background: ${(props) => props.theme.palette.background.main}; */`;

const ReportBodyItem = styled.div``;

class Report extends Component {
	state = {};

	componentDidMount() {
		let current = 0;
		let done = false;
		const reductiveDownloadChain = (items) => {
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
							responses.push(res.data.data);
							if (current === items.length && !done) {
								this.setState({
									responses
								});
								done = true;
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
			<ReportBody className={'report_body'} theme={theme}>
				{stats.map((stat, index) => {
					return (
						<ReportBodyItem className="report_body_item" theme={theme} key={stat._id}>
							<ReportBodyItemHeader stat={stat} />
							<ReportBodyItemBody stat={stat} />
						</ReportBodyItem>
					);
				})}
			</ReportBody>
		);
	}
}

export default withTheme(Report);
