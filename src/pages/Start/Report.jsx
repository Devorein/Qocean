import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { withTheme } from '@material-ui/core';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import shortid from 'shortid';
import './Report.scss';

const ReportBody = styled.div`/* background: ${(props) => props.theme.palette.background.main}; */`;

const ReportBodyItem = styled.div``;

const ReportBodyItemHeader = styled.div`background: ${(props) => props.theme.palette.background.dark};`;

const ReportBodyItemBody = styled.div`background: ${(props) => props.theme.palette.background.main};`;

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
							<ReportBodyItemHeader theme={theme}>
								<div key={shortid.generate()} className={`report_body_item_header--name report_body_item_header_item`}>
									{stat.name}
								</div>
								<div className="report_body_item_header_meta report_body_item_header_item">
									{[ 'type', 'time_allocated', 'time_taken', 'weight' ].map((item) => (
										<div
											key={shortid.generate()}
											className={`report_body_item_header_meta--${item} report_body_item_header_meta_item`}
											style={{ backgroundColor: theme.palette.background.light }}
										>
											{stat[item]}
										</div>
									))}
								</div>
							</ReportBodyItemHeader>
							<ReportBodyItemBody theme={theme}>
								<TreeView
									defaultCollapseIcon={<ExpandMoreIcon />}
									defaultExpandIcon={<ChevronRightIcon />}
									defaultExpanded={[ '0' ]}
								>
									<TreeItem nodeId="1" label={'Options & Answers'}>
										{stat.options.map((option) => <div key={shortid.generate()}>{option}</div>)}
									</TreeItem>
								</TreeView>
							</ReportBodyItemBody>
						</ReportBodyItem>
					);
				})}
			</ReportBody>
		);
	}
}

export default withTheme(Report);
