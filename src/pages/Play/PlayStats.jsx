import React, { Component } from 'react';
import BasicTable from '../../components/DataTable/BasicTable';

class PlayStats extends Component {
	calculateQuestions = () => {
		const { selectedQuizzes: quizzes = [] } = this.props;
		let res = 0;
		for (let quiz of quizzes) res += quiz.total_questions;
		return `${res} Question(s)`;
	};
	calculateDifficulty = () => {
		const { selectedQuizzes: quizzes } = this.props;
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
		const { selectedQuizzes: quizzes } = this.props;
		let res = 0;
		if (quizzes.length === 0) return `0s`;
		for (let quiz of quizzes) res += quiz.average_quiz_time;
		return `${(res / quizzes.length).toFixed(2)} (s)`;
	};

	calculateTypeTable = () => {
		const { quizzes } = this.props;
		const rows = [];
		const headers = [ 'MCQ', 'MS', 'FIB', 'FC', 'Snippet', 'TF' ];
		for (let i = 0; i < quizzes.length; i++) {
			const quiz = quizzes[i];
			const temp = {};

			headers.forEach((header) => {
				temp[header] = 0;
			});

			quiz.questions.forEach((question) => {
				temp[question.type] = temp[question.type] ? temp[question.type] + 1 : 1;
			});

			rows.push({
				name: quiz.name,
				...temp
			});
		}
		headers.unshift('name');
		return [
			headers.map((name) => {
				return {
					name
				};
			}),
			rows.length !== 0 ? rows : []
		];
	};

	calculateDifficultyTable = () => {
		const { quizzes } = this.props;
		const rows = [];
		const headers = [ 'Beginner', 'Intermediate', 'Advanced' ];
		for (let i = 0; i < quizzes.length; i++) {
			const quiz = quizzes[i];
			const temp = {};

			headers.forEach((header) => {
				temp[header] = 0;
			});

			quiz.questions.forEach((question) => {
				temp[question.difficulty] = temp[question.difficulty] ? temp[question.difficulty] + 1 : 1;
			});

			rows.push({
				name: quiz.name,
				...temp
			});
		}
		headers.unshift('name');
		return [
			headers.map((header) => {
				return {
					name: header
				};
			}),
			rows.length !== 0 ? rows : []
		];
	};

	render() {
		const {
			calculateQuestions,
			calculateDifficulty,
			calculateTime,
			calculateDifficultyTable,
			calculateTypeTable
		} = this;
		const [ difficultyHeaders, difficultyRows ] = calculateDifficultyTable();
		const [ typeHeaders, typeRows ] = calculateTypeTable();
		return (
			<div className="play_stats">
				<div className="play_stats-questions">{calculateQuestions()}</div>
				<div className="play_stats-time">{calculateTime()}</div>
				<div className="play_stats-difficulty">{calculateDifficulty()}</div>
				<BasicTable title={'Question Difficulty'} headers={difficultyHeaders} rows={difficultyRows} />
				<BasicTable title={'Question Types'} headers={typeHeaders} rows={typeRows} />
			</div>
		);
	}
}

export default PlayStats;
