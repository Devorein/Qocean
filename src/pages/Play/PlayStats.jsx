import React, { Component } from 'react';
import BasicTable from '../../components/DataTable/BasicTable';

class PlayStats extends Component {
	calculateQuestions = () => {
		const { quizzes = [] } = this.props;
		let res = 0;
		for (let quiz of quizzes) res += quiz.total_questions;
		return `${res} Question(s)`;
	};
	calculateDifficulty = () => {
		const { quizzes } = this.props;
		let res = 0;
		if (quizzes.length === 0) return `None selected`;
		for (let quiz of quizzes) {
			const { average_difficulty } = quiz;
			let difficulty = 0;
			switch (average_difficulty) {
				case 'Beginner':
					difficulty = 3.33;
					break;
				case 'Intermediate':
					difficulty = 6.66;
					break;
				case 'Advanced':
					difficulty = 10;
					break;
				default:
					break;
			}
			res += difficulty;
		}
		res = res / quizzes.length;
		if (res <= 3.33) res = 'Beginner';
		else if (res <= 6.66) res = 'Intermediate';
		else if (res <= 10) res = 'Advanced';
		return `${res}`;
	};
	calculateTime = () => {
		const { quizzes } = this.props;
		let res = 0;
		if (quizzes.length === 0) return `0s`;
		for (let quiz of quizzes) res += quiz.average_quiz_time;
		return `${(res / quizzes.length).toFixed(2)} (s)`;
	};

	render() {
		const { calculateQuestions, calculateDifficulty, calculateTime } = this;
		return (
			<div className="play_stats">
				<div className="play_stats-questions">{calculateQuestions()}</div>
				<div className="play_stats-time">{calculateTime()}</div>
				<div className="play_stats-difficulty">{calculateDifficulty()}</div>
			</div>
		);
	}
}

export default PlayStats;
