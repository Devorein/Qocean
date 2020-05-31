import React, { Component } from 'react';
import styled from 'styled-components';
import shortid from 'shortid';
import { withTheme } from '@material-ui/core';
import Color from 'color';
import convert from 'color-convert';

const ReportBodyItemBody = styled.div`
	& .report_body_item_body_option {
		background: ${(props) => Color.rgb(convert.hex.rgb(props.theme.palette.background.dark)).lighten(0.1).hex()};
		&--correct .color {
			background: ${(props) => props.theme.palette.success.main};
		}
		&--incorrect .color {
			background: ${(props) => props.theme.palette.error.main};
		}
		&--none .color {
			background: ${(props) => props.theme.palette.grey[900]};
		}
	}
`;

class ReportBodyItemBodyClass extends Component {
	renderBodyOptions = (stat) => {
		const { theme, answer: { answers } } = this.props;
		if (stat.type === 'MCQ')
			return stat.options.map((option, index) => {
				let status = null;
				if (
					(parseInt(stat.user_answers[0]) === index && index === parseInt(answers[0])) ||
					index === parseInt(answers[0])
				)
					status = 'correct';
				else if (parseInt(stat.user_answers[0]) === index && parseInt(answers[0]) !== index) status = 'incorrect';
				else status = 'none';

				const props = {
					className: `report_body_item_body_option report_body_item_body_option--${status}`,
					theme,
					key: shortid.generate()
				};

				return (
					<div {...props}>
						<span className="color" />
						{option}
					</div>
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
