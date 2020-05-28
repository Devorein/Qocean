import React, { Component } from 'react';
import styled from 'styled-components';
import { withTheme } from '@material-ui/core';

const QuizContent = styled.div`
	display: grid;
	grid-template: 100px 1fr / 1fr 1fr;
	grid-gap: 5px;
`;

const QuestionName = styled.div`
	display: flex;
	font-size: 22px;
	font-weight: bold;
	padding: 20px;
	grid-area: 1/1/2/3;
	justify-content: center;
	align-items: center;
	background: ${(props) => props.theme.palette.background.dark};
`;

const QuestionOption = styled.div`
	display: flex;
	font-size: 18px;
	padding: 5px 20px;
	width: 100%100fr;
	justify-content: center;
	align-items: center;
	background: ${(props) => props.theme.palette.background.main};
	min-height: 50px;
	text-align: center;
	cursor: pointer;
`;

class Quiz extends Component {
	render() {
		const { question, theme } = this.props;
		return question ? (
			<QuizContent theme={theme}>
				<QuestionName theme={theme}>{question.name}</QuestionName>
				{question.options.map((option) => <QuestionOption theme={theme}>{option}</QuestionOption>)}
			</QuizContent>
		) : (
			<div>Loading question</div>
		);
	}
}

export default withTheme(Quiz);
