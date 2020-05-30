import React, { Component } from 'react';
import GenericButton from '../../components/Buttons/GenericButton';
import Question from './Question';
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

class Quiz extends Component {
	state = {
		currentQuestion: 0,
		currentQuiz: 0,
		currentQuizQuestion: 0,
		question: null,
		stats: [],
		isOnReport: false
	};

	componentDidMount() {
		this.fetchQuestion();
		this.updatePlayedTimes();
	}

	updatePlayedTimes = () => {
		axios
			.put(
				`http://localhost:5001/api/v1/quizzes/_/updatePlayedTimes`,
				{
					quizzes: this.props.quizzes.map((quiz) => quiz._id)
				},
				{
					headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
				}
			)
			.then((data) => {})
			.catch((err) => {});
	};

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
		// const { user_answers } = this.Quiz.state;
		const { stats, question } = this.state;
		// stats.push({ user_answers, _id: question._id, type: question.type, time_taken: question.time_allocated - timeout });
		if (currentQuestion < totalQuestion - 1) {
			this.setState(
				{
					currentQuestion: currentQuestion + 1,
					currentQuizQuestion,
					currentQuiz,
					stats
				},
				() => {
					this.fetchQuestion();

					// if (this.Quiz) {
					// 	this.Quiz.setState({
					// 		show_answer: false,
					// 		user_answers: []
					// 	});
					// }
				}
			);
		} else {
			// this.Quiz.setState({
			// 	show_answer: false,
			// 	user_answers: []
			// });
			// this.setState({
			// 	currentQuestion: currentQuestion + 1,
			// 	stats,
			// 	timeout: 0,
			// 	isOnReport: true
			// });
		}
	};
	renderQuizStats = () => {
		const { quizzes, theme } = this.props;
		const { currentQuestion, currentQuiz, currentQuizQuestion, question, timeout, isOnReport } = this.state;
		const totalQuestion = this.getTotalQuestions();

		const stats = [
			[ 'Quiz', `${currentQuiz + 1} / ${quizzes.length}` ],
			[ 'Name', quizzes[currentQuiz].name ],
			[ `Question of Quiz`, currentQuizQuestion + 1 ],
			[ 'Question', `${currentQuestion + 1} of ${totalQuestion}` ]
		];

		return (
			<QuizStats theme={theme}>
				{stats.map(([ key, value ]) => (
					<QuizStat theme={theme} key={key}>
						<span className="question_stat_key">{key}</span> :
						<span className="question_stat_value">{value.toString()}</span>
					</QuizStat>
				))}
			</QuizStats>
		);
	};
	render() {
		const { getTotalQuestions, setQuestion, renderQuizStats } = this;
		const { currentQuestion } = this.state;
		const totalQuestion = getTotalQuestions();

		return currentQuestion < totalQuestion ? (
			<Timer
				timeout={this.state.question ? this.state.question.time_allocated : 0}
				onTimerEnd={() => {
					this.Button.click();
				}}
			>
				{({ currentTime, timer, clearInterval }) => {
					return (
						<div className={`start`} style={{ gridArea: '1/1/span 3/span 3' }}>
							{renderQuizStats()}
							<GenericButton
								buttonRef={(ref) => (this.Button = ref)}
								text={currentQuestion + 1 < totalQuestion ? 'Next' : 'Report'}
								onClick={(e) => {
									clearInterval();
									setQuestion(totalQuestion);
								}}
							/>
							{timer}
						</div>
					);
				}}
			</Timer>
		) : (
			<Report stats={this.state.stats} />
		);
	}
}

export default withTheme(Quiz);
