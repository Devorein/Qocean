import React, { Component } from 'react';
import GenericButton from '../../components/Buttons/GenericButton';
import Quiz from '../../components/Quiz/Quiz';
import axios from 'axios';

class Start extends Component {
	state = {
		currentQuestion: 0,
		currentQuiz: 0,
		currentQuizQuestion: 0,
		question: null
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
		axios.get(`http://localhost:5001/api/v1/questions?_id=${current_id}`).then(({ data }) => {
			this.setState({
				question: data.data
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
		if (currentQuestion < totalQuestion - 1)
			this.setState(
				{
					currentQuestion: currentQuestion + 1,
					currentQuizQuestion,
					currentQuiz
				},
				() => {
					this.fetchQuestion();
				}
			);
	};

	render() {
		const { getTotalQuestions, setQuestion } = this;
		const { currentQuestion, currentQuiz, currentQuizQuestion, question } = this.state;
		const { quizzes, settings } = this.props;
		const totalQuestion = getTotalQuestions();
		return (
			<div className={`start`} style={{ gridArea: '1/1/span 3/span 3' }}>
				<div>
					Quiz {currentQuiz + 1} of {quizzes.length}
				</div>
				<div>{quizzes[currentQuiz].name}</div>
				<div>
					Question {currentQuizQuestion + 1} of Quiz {currentQuiz + 1}
				</div>
				<div>
					Question {currentQuestion + 1} of {totalQuestion}
				</div>
				<Quiz question={question} />
				<GenericButton
					text={currentQuestion + 1 < totalQuestion ? 'Next' : 'Report'}
					onClick={setQuestion.bind(null, totalQuestion)}
				/>
			</div>
		);
	}
}

export default Start;
