import React, { Component } from 'react';
import styled from 'styled-components';
import shortid from 'shortid';
import { withTheme } from '@material-ui/core';
import Color from 'color';
import convert from 'color-convert';

const ReportBodyItemBody = styled.div``;

const ReportBodyItemBodyOptionInc = styled.div`
	background: ${(props) => Color.rgb(convert.hex.rgb(props.theme.palette.background.dark)).lighten(0.1).hex()};
	& .color {
		background: ${(props) => props.theme.palette.error.main};
	}
`;
const ReportBodyItemBodyOptionCor = styled.div`
	background: ${(props) => Color.rgb(convert.hex.rgb(props.theme.palette.background.dark)).lighten(0.1).hex()};
	& .color {
		background: ${(props) => props.theme.palette.success.main};
	}
`;

const ReportBodyItemBodyOptionNone = styled.div`
	background: ${(props) => Color.rgb(convert.hex.rgb(props.theme.palette.background.dark)).lighten(0.1).hex()};
	& .color {
		background: ${(props) => props.theme.palette.grey[900]};
	}
`;

class ReportBodyItemBodyClass extends Component {
	renderBodyOptions = (stat) => {
		const { theme, response } = this.props;
		if (stat.type === 'MCQ')
			return stat.options.map((option, index) => {
				const props = {
					className: 'report_body_item_body_option',
					theme,
					key: shortid.generate()
				};
				if (
					(parseInt(stat.user_answers[0]) === index && index === parseInt(response[0]) - 1) ||
					index === parseInt(response[0]) - 1
				)
					return (
						<ReportBodyItemBodyOptionCor {...props}>
							<span className="color" />
							{option}
						</ReportBodyItemBodyOptionCor>
					);
				else if (parseInt(stat.user_answers[0]) === index && parseInt(response[0]) - 1 !== index)
					return (
						<ReportBodyItemBodyOptionInc {...props}>
							<span className="color" />
							{option}
						</ReportBodyItemBodyOptionInc>
					);
				else
					return (
						<ReportBodyItemBodyOptionNone {...props}>
							<span className="color" />
							{option}
						</ReportBodyItemBodyOptionNone>
					);
			});
	};

	render() {
		const { theme, stat } = this.props;

		return (
			<ReportBodyItemBody theme={theme} className={`report_body_item_body report_body_item_body--${stat.type}`}>
				{this.renderBodyOptions(stat)}
			</ReportBodyItemBody>
		);
	}
}

export default withTheme(ReportBodyItemBodyClass);
