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

	renderReport = () => {
		const { theme, stats } = this.props;
		return this.state.responses.map((response, index) => {
			return (
				<ReportBodyItem className="report_body_item" theme={theme} key={stats[index]._id}>
					<ReportBodyItemHeader stat={stats[index]} response={response} />
					<ReportBodyItemBody stat={stats[index]} response={response} />
				</ReportBodyItem>
			);
		});
	};

	render() {
		const { theme, stats } = this.props;
		return (
			<ReportBody className={'report_body'} theme={theme}>
				{this.renderReport()}
			</ReportBody>
		);
	}
}

export default withTheme(Report);
