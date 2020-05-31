import React, { Component } from 'react';
import styled from 'styled-components';
import shortid from 'shortid';
import { withTheme } from '@material-ui/core';

const ReportBodyItemBody = styled.div`background: ${(props) => props.theme.palette.background.main};`;
const ReportBodyItemBodyOptionInc = styled.div`
	& .color {
		background: ${(props) => props.theme.palette.error.main};
	}
`;
const ReportBodyItemBodyOptionCor = styled.div`
	& .color {
		background: ${(props) => props.theme.palette.success.main};
	}
`;

const ReportBodyItemBodyOptionNone = styled.div`
	& .color {
		background: ${(props) => props.theme.palette.grey[900]};
	}
`;

class ReportBodyItemBodyClass extends Component {
	renderBodyOptions = (stat) => {
		const { theme, response } = this.props;
		if (stat.type === 'MCQ')
			return stat.options.map((option, index) => {
				if (
					(parseInt(stat.user_answers[0]) === index && index === parseInt(response[0]) - 1) ||
					index === parseInt(response[0]) - 1
				)
					return (
						<ReportBodyItemBodyOptionCor
							className="report_body_item_body_option"
							theme={theme}
							key={shortid.generate()}
						>
							<span className="color" />
							{option}
						</ReportBodyItemBodyOptionCor>
					);
				else if (parseInt(stat.user_answers[0]) === index && parseInt(response[0]) - 1 !== index)
					return (
						<ReportBodyItemBodyOptionInc
							className="report_body_item_body_option"
							theme={theme}
							key={shortid.generate()}
						>
							<span className="color" />
							{option}
						</ReportBodyItemBodyOptionInc>
					);
				else
					return (
						<ReportBodyItemBodyOptionNone
							className="report_body_item_body_option"
							theme={theme}
							key={shortid.generate()}
						>
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
