import React, { Component, Fragment } from 'react';
import Question from './Question';
import axios from 'axios';
import { withStyles } from '@material-ui/core';

import GenericButton from '../../components/Buttons/GenericButton';
import Timer from '../../components/Timer/Timer';
import Report from './Report/Report';
import arrayShuffler from '../../Utils/arrayShuffler';
import './Quiz.scss';

class Quiz extends Component {
	state = {
		currentQuestion: 0,
		currentQuiz: 0,
		currentQuizQuestion: 0,
		question: null,
		stats: [],
		isOnReport: false,
		showTimer: true,
		quizResults: {
			correct: 0,
			incorrect: 0
		}
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

	setQuestion = (timeout, { user_answers, reset_answers }) => {
		const totalQuestion = this.getTotalQuestions();
		const { quizzes, settings } = this.props;
		let { currentQuestion, currentQuiz, currentQuizQuestion, quizResults } = this.state;
		if (currentQuizQuestion < quizzes[currentQuiz].questions.length - 1) currentQuizQuestion++;
		else {
			currentQuiz++;
			currentQuizQuestion = 0;
		}
		const {
			stats,
			question: { _id, name, type, time_allocated, options, add_to_score, difficulty, weight }
		} = this.state;
		stats.push({
			user_answers,
			_id,
			name,
			type,
			time_taken: time_allocated - timeout,
			options,
			difficulty,
			weight,
			time_allocated,
			add_to_score
		});

		const getNextQuestion = () => {
			if (currentQuestion < totalQuestion - 1) {
				this.setState(
					{
						currentQuestion: currentQuestion + 1,
						currentQuizQuestion,
						currentQuiz,
						stats,
						showTimer: false,
						quizResults
					},
					() => {
						this.fetchQuestion();
						reset_answers();
						setTimeout(() => {
							this.setState({
								showTimer: true
							});
						}, 1000);
					}
				);
			} else {
				this.setState(
					{
						currentQuestion: currentQuestion + 1,
						stats,
						isOnReport: true,
						quizResults
					},
					() => {
						reset_answers();
					}
				);
			}
		};

		if (settings.validation === 'instant') {
			axios
				.put(`http://localhost:5001/api/v1/questions/_/validation`, {
					id: _id,
					answers: user_answers
				})
				.then(({ data }) => {
					const { isCorrect } = data;
					if (isCorrect) quizResults.correct++;
					else quizResults.incorrect++;
					getNextQuestion();
				});
		} else getNextQuestion();
	};

	renderQuizStats = () => {
		const { quizzes, theme, settings } = this.props;
		const { currentQuestion, currentQuiz, currentQuizQuestion, quizResults } = this.state;
		const totalQuestion = this.getTotalQuestions();

		const stats = [
			[ 'Quiz', `${currentQuiz + 1} / ${quizzes.length}` ],
			[ 'Name', quizzes[currentQuiz].name ],
			[ `Question of Quiz`, currentQuizQuestion + 1 ],
			[ 'Question', `${currentQuestion + 1} of ${totalQuestion}` ]
		];

		if (settings.validation === 'instant')
			stats.push(
				[ 'Correct', `${quizResults.correct}`, { color: theme.palette.success.main } ],
				[ 'Incorrect', `${quizResults.incorrect}`, { color: theme.palette.error.main } ]
			);

		return (
			<div className="Quiz_Stats">
				{stats.map(([ key, value, style ]) => (
					<div key={key} className={'Quiz_Stats_Item'}>
						<span className="question_stat_key">{key}</span> :
						<span className="question_stat_value" style={style ? style : {}}>
							{value.toString()}
						</span>
					</div>
				))}
			</div>
		);
	};

	transformOption = (question) => {
		if (this.props.settings.randomized_options && question.type === 'MCQ') {
			if (!question.shuffled) {
				question.options = arrayShuffler(question.options.map((option, index) => ({ option, index })));
				question.shuffled = true;
			}
		} else if (!this.props.settings.randomized_options && question.type === 'MCQ') question.shuffled = false;
		else if (this.props.settings.randomized_options && question.type === 'MS') {
			if (!question.shuffled) {
				question.options = arrayShuffler(question.options.map((option, index) => ({ option, index })));
				question.shuffled = true;
			}
		} else if (!this.props.settings.randomized_options && question.type === 'MS') question.shuffled = false;
	};

	render() {
		const { getTotalQuestions, setQuestion, renderQuizStats, transformOption } = this;
		const { currentQuestion, question } = this.state;
		if (question) transformOption(question);
		const totalQuestion = getTotalQuestions();
		return currentQuestion < totalQuestion ? (
			<div className={`Quiz ${this.props.classes.root}`} style={{ gridArea: '1/1/span 3/span 3' }}>
				{question ? (
					<Question question={question}>
						{({ question, questionManip }) => {
							this.questionManip = questionManip;
							return (
								<Fragment>
									{renderQuizStats()}
									{question}
								</Fragment>
							);
						}}
					</Question>
				) : null}
				{this.state.showTimer && this.state.question ? (
					<Timer
						timeout={this.state.question.time_allocated}
						onTimerEnd={() => {
							if (this.Button) this.Button.click();
						}}
					>
						{({ currentTime, timer, clearInterval }) => {
							return (
								<Fragment>
									{timer}
									<GenericButton
										buttonRef={(ref) => (this.Button = ref)}
										text={currentQuestion + 1 < totalQuestion ? 'Next' : 'Report'}
										onClick={(e) => {
											clearInterval();
											setQuestion(currentTime, this.questionManip);
										}}
									/>
								</Fragment>
							);
						}}
					</Timer>
				) : null}
			</div>
		) : (
			<Report
				quizzes={this.props.quizzes.map((quiz) => quiz._id)}
				stats={this.state.stats}
				settings={this.props.settings}
			/>
		);
	}
}

export default withStyles((theme) => ({
	root: {
		'& .Quiz_Stats': {
			background: theme.palette.background.dark
		},
		'& .Quiz_Stats_Item': {
			background: theme.palette.background.main
		}
	}
}))(Quiz);
