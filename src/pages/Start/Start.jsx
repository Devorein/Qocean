import React, { Component } from 'react';
import GenericButton from '../../components/Buttons/GenericButton';

class Start extends Component {
	state = {
		currentQuestion: 1
	};
	getTotalQuestions = () => {
		let totalQuiz = 0;
		this.props.quizzes.forEach((quiz) => (totalQuiz += quiz.questions.length));
		return totalQuiz;
	};

	render() {
		const { getTotalQuestions } = this;
		const { currentQuestion } = this.state;
		const { quizzes, settings } = this.props;

		return (
			<div className={`start`}>
				<div>
					{currentQuestion} / {getTotalQuestions()}
				</div>
				{quizzes.map((quiz) => {
					return <div key={quiz._id}>{quiz.name}</div>;
				})}
				<GenericButton
					text={'Next'}
					onClick={(e) => {
						if (currentQuestion < getTotalQuestions())
							this.setState({
								currentQuestion: currentQuestion + 1
							});
					}}
				/>
			</div>
		);
	}
}

export default Start;
