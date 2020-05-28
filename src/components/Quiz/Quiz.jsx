import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { withTheme } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import GenericButton from '../../components/Buttons/GenericButton';
import shortid from 'shortid';

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
	& .question_stat_value {
		margin-left: 5px;
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
	state = {
		user_answers: [ '' ],
		show_answer: false
	};

	getFlashCardAnswer = () => {
		axios
			.get(`http://localhost:5001/api/v1/questions/answers/${this.props.question._id}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			})
			.then(({ data: { data: [ answer ] } }) => {
				this.setState({
					show_answer: true,
					answers: answer
				});
			});
	};
	renderQuestionBody = () => {
		const { question: { type, options, name }, theme } = this.props;
		if (type === 'MCQ')
			return (
				<QuestionOptions>
					{options.map((option, index) => (
						<QuestionOption theme={theme} key={option}>
							<Checkbox
								checked={this.state.user_answers.indexOf(index) !== -1}
								onChange={(e) => {
									let { user_answers } = this.state;
									if (e.target.checked) user_answers.push(index);
									else user_answers = user_answers.filter((answer) => answer !== index);
									this.setState({ user_answers });
								}}
								color="primary"
							/>
							{option}
						</QuestionOption>
					))}
				</QuestionOptions>
			);
		else if (type === 'MS')
			return (
				<QuestionOptions>
					{options.map((option, index) => (
						<QuestionOption theme={theme} key={option}>
							<Checkbox
								checked={this.state.user_answers[0] === index}
								onChange={(e) => {
									let { user_answers } = this.state;
									if (e.target.checked) user_answers = [ index ];
									else user_answers = user_answers.filter((answer) => answer !== index);
									this.setState({ user_answers });
								}}
								color="primary"
							/>
							{option}
						</QuestionOption>
					))}
				</QuestionOptions>
			);
		else if (type === 'FIB')
			return name.match(/\$\{\_\}/g).map((match, index) => {
				return (
					<TextField
						key={shortid.generate()}
						value={this.state.user_answers[index]}
						onChange={(e) => {
							const { user_answers } = this.state;
							user_answers[index] = e.target.value;
							this.setState({
								user_answers
							});
						}}
					/>
				);
			});
		else if (type === 'TF')
			return (
				<FormControl>
					<FormLabel component="legend">Answer</FormLabel>
					<RadioGroup
						row
						name={'Answer'}
						value={this.state.user_answers[0]}
						onChange={(e) =>
							this.setState({
								user_answers: [ e.target.value ]
							})}
					>
						{[ 'True', 'False' ].map((value) => (
							<FormControlLabel
								key={value}
								control={<Radio color="primary" />}
								value={value}
								label={value}
								labelPlacement="end"
							/>
						))}
					</RadioGroup>
				</FormControl>
			);
		else if (type === 'Snippet')
			return (
				<TextField
					value={this.state.user_answers[0]}
					onChange={(e) => {
						this.setState({
							user_answers: [ e.target.value ]
						});
					}}
				/>
			);
		else if (type === 'FC')
			return (
				<Fragment>
					{!this.state.show_answer ? (
						<GenericButton
							text={'show'}
							onClick={(e) => {
								this.getFlashCardAnswer();
							}}
						/>
					) : (
						<Fragment>
							<div>{this.state.answers.map((answer) => answer)}</div>
							<GenericButton
								text={'Mark as correct'}
								onClick={(e) =>
									this.setState({
										user_answers: [ true ]
									})}
							/>
						</Fragment>
					)}
				</Fragment>
			);
		else return <div>{type}</div>;
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
				{this.renderQuestionBody()}
			</QuizContent>
		) : (
			<div>Loading question</div>
		);
	}
}

export default withTheme(Quiz);
