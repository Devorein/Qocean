import React, { Component } from 'react';
import GenericButton from '../../components/Buttons/GenericButton';
import Quiz from '../../components/Quiz/Quiz';
class Start extends Component {
	state = {
		currentQuestion: 0,
		currentQuiz: 0,
		currentQuizQuestion: 0
	};

	getTotalQuestions = () => {
		let totalQuiz = 0;
		this.props.quizzes.forEach((quiz) => (totalQuiz += quiz.questions.length));
		return totalQuiz;
	};

	fetchQuestion = () => {
		const { currentQuestion, currentQuiz } = this.state;
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
			this.setState({
				currentQuestion: currentQuestion + 1,
				currentQuizQuestion,
				currentQuiz
			});
	};

	render() {
		const { getTotalQuestions, setQuestion } = this;
		const { currentQuestion, currentQuiz, currentQuizQuestion } = this.state;
		const { quizzes, settings } = this.props;
		const totalQuestion = getTotalQuestions();
		return (
			<div className={`start`}>
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
				{/* <Quiz/> */}
				<GenericButton
					text={currentQuestion + 1 < totalQuestion ? 'Next' : 'Report'}
					onClick={setQuestion.bind(null, totalQuestion)}
				/>
			</div>
		);
	}
}

export default Start;
