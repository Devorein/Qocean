import React, { Component } from 'react';
import styled from 'styled-components';
import { withTheme } from '@material-ui/core';

const QuizContent = styled.div``;

const flexCenter = `
  display: flex;
  justify-content: center;
  align-items: center;
`;

const QuestionStats = styled.div`
	background: ${(props) => props.theme.palette.background.dark};
	padding: 5px;
	${flexCenter};
`;

const QuestionStat = styled.div`
	${flexCenter};
	padding: 5px;
	font-size: 14px;
	background: ${(props) => props.theme.palette.background.main};
	& .question_stat_key {
		font-weight: bolder;
		font-size: 16px;
	}
	margin-right: 5px;
	border-radius: 5px;
`;

const QuestionName = styled.div`
	font-size: 22px;
	font-weight: bold;
	padding: 20px;
	${flexCenter};
	background: ${(props) => props.theme.palette.background.dark};
`;

const QuestionOptions = styled.div`
	display: grid;
	grid-template: 100px 1fr / 1fr 1fr;
	grid-gap: 5px;
`;

const QuestionOption = styled.div`
	font-size: 18px;
	padding: 5px 20px;
	width: 100%;
	${flexCenter};
	background: ${(props) => props.theme.palette.background.main};
	min-height: 50px;
	text-align: center;
	cursor: pointer;
	border-radius: 5px;
`;

class Quiz extends Component {
	renderQuestion = () => {
		const { question: { type } } = this.props;
	};

	decideLabel = (label) => {
		return label.split('_').map((chunk) => chunk.charAt(0).toUpperCase() + chunk.substr(1)).join(' ');
	};

	render() {
		const { decideLabel } = this;
		const { question, theme } = this.props;
		const stats = [ 'difficulty', 'add_to_score', 'type', 'weight' ];
		return question ? (
			<QuizContent theme={theme}>
				<QuestionStats theme={theme}>
					{stats.map((stat) => (
						<QuestionStat theme={theme} key={stat}>
							<span className="question_stat_key">{decideLabel(stat)}</span> :
							<span className="question_stat_value">{question[stat].toString()}</span>
						</QuestionStat>
					))}
				</QuestionStats>
				<QuestionName theme={theme}>{question.name}</QuestionName>
				<QuestionOptions>
					{question.options.map((option) => (
						<QuestionOption theme={theme} key={option}>
							{option}
						</QuestionOption>
					))}
				</QuestionOptions>
			</QuizContent>
		) : (
			<div>Loading question</div>
		);
	}
}

export default withTheme(Quiz);
