import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import shortid from 'shortid';
import { withTheme } from '@material-ui/core';
import { orange } from '@material-ui/core/colors';
import Color from 'color';
import convert from 'color-convert';

const ReportBodyItemBody = styled.div`
	& .report_body_item_body_option {
		background: ${(props) => Color.rgb(convert.hex.rgb(props.theme.palette.background.dark)).lighten(0.1).hex()};
		&--correct_selected .color {
			background: ${(props) => props.theme.palette.success.main};
		}
		&--correct .color {
			background: ${orange[500]};
		}
		&--incorrect .color {
			background: ${(props) => props.theme.palette.error.main};
		}
		&--none .color {
			background: ${(props) => props.theme.palette.grey[800]};
		}
	}
`;

class ReportBodyItemBodyClass extends Component {
	renderBodyOptions = () => {
		let { answer: { answers }, stat } = this.props;
		let { user_answers, type, options } = stat;
		if (type === 'TF') options = [ 'False', 'True' ];
		let status = null;

		if (type === 'MCQ' || type === 'MS' || type === 'TF') {
			answers = answers.map((answer) => parseInt(answer));
			user_answers = user_answers.map((answer) => parseInt(answer));

			return options.map((option, index) => {
				if (type === 'MCQ') {
					if (user_answers[0] === index && index === answers[0]) status = 'correct_selected';
					else if (index === answers[0]) status = 'correct';
					else if (user_answers[0] === index && answers[0] !== index) status = 'incorrect';
					else status = 'none';
				} else if (type === 'MS') {
					if (user_answers.includes(index) && answers.includes(index)) status = 'correct_selected';
					else if (answers.includes(index)) status = 'correct';
					else if (user_answers.includes(index) && !answers.includes(index)) status = 'incorrect';
					else status = 'none';
				} else if (type === 'TF') {
					if (index === answers[0] && answers[0] !== user_answers[0]) status = 'correct';
					else if (index !== answers[0] && index === user_answers[0]) status = 'incorrect';
					else if (index === answers[0] && index === user_answers[0]) status = 'correct_selected';
					else status = 'none';
				}
				const props = {
					className: `report_body_item_body_option report_body_item_body_option--${status}`,
					key: shortid.generate()
				};
				return (
					<div {...props}>
						<span className="color" />
						{this.props.random && option.option ? option.option : option}
					</div>
				);
			});
		} else if (type === 'Snippet') {
			let user_answer = null;
			if (!answers[0].includes(user_answers[0])) {
				status = 'incorrect';
				const props = {
					className: `report_body_item_body_option report_body_item_body_option--${status}`,
					key: shortid.generate()
				};
				user_answer = (
					<div {...props}>
						<span className="color" />
						{user_answers[0]}
					</div>
				);
			}
			return (
				<Fragment>
					{answers[0].map((answer) => {
						if (answer === user_answers[0]) status = 'correct_selected';
						else status = 'correct';
						const props = {
							className: `report_body_item_body_option report_body_item_body_option--${status}`,
							key: shortid.generate()
						};
						return (
							<div {...props}>
								<span className="color" />
								{answer}
							</div>
						);
					})}
					{user_answer}
				</Fragment>
			);
		} else if (type === 'FIB') {
			return answers.map((answer, index) => {
				let user_answer = null;
				if (!answer.includes(user_answers[index])) {
					status = 'incorrect';
					const props = {
						className: `report_body_item_body_option report_body_item_body_option--${status}`,
						key: shortid.generate()
					};
					user_answer = (
						<div {...props}>
							<span className="color" />
							{user_answers[index]}
						</div>
					);
				}
				return (
					<div
						className={`report_body_item_body_row report_body_item_body_row--${answer.length + (user_answer ? 1 : 0)}`}
						key={shortid.generate()}
					>
						{answer.map((chunk) => {
							if (chunk.toString() === user_answers[index]) status = 'correct_selected';
							else status = 'correct';
							const props = {
								className: `report_body_item_body_option report_body_item_body_option--${status}`,
								key: shortid.generate()
							};
							return (
								<div {...props}>
									<span className="color" />
									{chunk}
								</div>
							);
						})}
						{user_answer}
					</div>
				);
			});
		} else if (type === 'FC') {
			return answers[0].map((answer, index) => {
				if (user_answers.includes(index)) status = 'correct_selected';
				else status = 'correct';
				const props = {
					className: `report_body_item_body_option report_body_item_body_option--${status}`,
					key: shortid.generate()
				};
				return (
					<div {...props}>
						<span className="color" />
						{answer}
					</div>
				);
			});
		}
	};

	render() {
		const { theme, stat } = this.props;

		return (
			<ReportBodyItemBody theme={theme} className={`report_body_item_body report_body_item_body--${stat.type}`}>
				{this.renderBodyOptions()}
			</ReportBodyItemBody>
		);
	}
}

export default withTheme(ReportBodyItemBodyClass);
