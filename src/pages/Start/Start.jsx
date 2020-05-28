import React, { Component } from 'react';
import GenericButton from '../../components/Buttons/GenericButton';
import Quiz from '../../components/Quiz/Quiz';
import axios from 'axios';
import styled from 'styled-components';
import { withTheme } from '@material-ui/core';
import Timer from '../../components/Timer/Timer';
import Report from './Report';

const flexCenter = `
  display: flex;
  justify-content: center;
  align-items: center;
`;

const QuizStats = styled.div`
	background: ${(props) => props.theme.palette.background.dark};
	padding: 5px;
	${flexCenter};
`;

const QuizStat = styled.div`
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

class Start extends Component {
	state = {
		currentQuestion: 0,
		currentQuiz: 0,
		currentQuizQuestion: 0,
		question: null,
		timeout: 30,
		stats: []
	};

	componentDidMount() {
		this.fetchQuestion();
	}

	getTotalQuestions = () => {
		let totalQuiz = 0;
		this.props.quizzes.forEach((quiz) => (totalQuiz += quiz.questions.length));
		return totalQuiz;
	};

	fetchQuestion = () => {
		const { quizzes } = this.props;
		const { currentQuizQuestion, currentQuiz } = this.state;
		const current_id = quizzes[currentQuiz].questions[currentQuizQuestion]._id;
		axios
			.get(`http://localhost:5001/api/v1/questions/me?_id=${current_id}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			})
			.then(({ data: { data } }) => {
				this.setState({
					question: data,
					timeout: data.time_allocated
				});
			});
	};

	setQuestion = (totalQuestion) => {
		const { quizzes } = this.props;
		let { currentQuestion, currentQuiz, currentQuizQuestion } = this.state;
		if (currentQuizQuestion < quizzes[currentQuiz].questions.length - 1) currentQuizQuestion++;
		else {
			currentQuiz++;
			currentQuizQuestion = 0;
		}
		const { user_answers } = this.Quiz.state;
		const { stats, question } = this.state;
		stats.push({ user_answers, _id: question._id, type: question.type });
		if (currentQuestion < totalQuestion - 1) {
			this.setState(
				{
					currentQuestion: currentQuestion + 1,
					currentQuizQuestion,
					currentQuiz,
					timeout: 0,
					stats
				},
				() => {
					if (this.Quiz) {
						this.Quiz.setState({
							show_answer: false,
							user_answers: []
						});
					}
					this.fetchQuestion();
				}
			);
		} else {
			this.Quiz.setState({
				show_answer: false,
				user_answers: []
			});
			this.setState({
				currentQuestion: currentQuestion + 1,
				stats
			});
		}
	};

	render() {
		const { getTotalQuestions, setQuestion } = this;
		const { currentQuestion, currentQuiz, currentQuizQuestion, question, timeout } = this.state;
		const { quizzes, settings, theme } = this.props;
		const totalQuestion = getTotalQuestions();
		const stats = [
			[ 'Quiz', `${currentQuiz + 1} / ${quizzes.length}` ],
			[ 'Name', quizzes[currentQuiz].name ],
			[ `Question of Quiz`, currentQuizQuestion + 1 ],
			[ 'Question', `${currentQuestion + 1} of ${totalQuestion}` ]
		];
		return currentQuestion < totalQuestion ? (
			<div className={`start`} style={{ gridArea: '1/1/span 3/span 3' }}>
				<QuizStats theme={theme}>
					{stats.map(([ key, value ]) => (
						<QuizStat theme={theme} key={key}>
							<span className="question_stat_key">{key}</span> :
							<span className="question_stat_value">{value.toString()}</span>
						</QuizStat>
					))}
				</QuizStats>
				<Quiz
					question={question}
					ref={(r) => {
						this.Quiz = r;
					}}
				/>
				<GenericButton
					buttonRef={(ref) => (this.Button = ref)}
					text={currentQuestion + 1 < totalQuestion ? 'Next' : 'Report'}
					onClick={setQuestion.bind(null, totalQuestion)}
				/>
				<Timer
					timeout={timeout}
					onTimerChange={() => {
						if (this.state.timeout === 0) this.Button.click();
						else
							this.setState({
								timeout: this.state.timeout - 1
							});
					}}
				/>
			</div>
		) : (
			<Report stats={this.state.stats} />
		);
	}
}

export default withTheme(Start);
