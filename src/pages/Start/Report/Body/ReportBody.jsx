import React, { Component } from 'react';
import Color from 'color';
import convert from 'color-convert';
import styled from 'styled-components';

import ReportBodyItemHeader from './Item/Header/ReportBodyItemHeader';
import ReportBodyItemBody from './Item/Body/ReportBodyItemBody';

const ReportBodyC = styled.div`/* background: ${(props) => props.theme.palette.background.main}; */`;
const ReportBodyItem = styled.div`
	margin: 5px;
	background: ${(props) => Color.rgb(convert.hex.rgb(props.theme.palette.background.main)).darken(0.1).hex()};
`;

class ReportBody extends Component {
	render() {
		const { theme, stats, responses } = this.props;
		return (
			<ReportBodyC className={'report_body'} theme={theme}>
				{responses.map((response, index) => {
					return (
						<ReportBodyItem className="report_body_item" theme={theme} key={stats[index]._id}>
							<ReportBodyItemHeader stat={stats[index]} response={response} />
							<ReportBodyItemBody stat={stats[index]} response={response} />
						</ReportBodyItem>
					);
				})}
			</ReportBodyC>
		);
	}
}

export default ReportBody;
