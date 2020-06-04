import React, { Component } from 'react';
import axios from 'axios';
import CustomList from '../../components/List/List';
import PlayStats from './PlayStats';
import PlaySettings from './PlaySettings';
import GenericButton from '../../components/Buttons/GenericButton';
import Quiz from '../Start/Quiz';
import arrayShuffler from '../../Utils/arrayShuffler';

import './Play.scss';

class Play extends Component {
	state = {
		quizzes: [],
		hasStarted: false,
		playsettings: null
	};

	componentDidMount() {
		axios
			.get(`http://localhost:5001/api/v1/quizzes/me?populate=questions&populateFields=type,difficulty`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			})
			.then(({ data: { data: quizzes } }) => {
				this.setState({
					quizzes: quizzes.map((quiz) => ({ ...quiz, filteredQuestions: [] }))
				});
			});
	}

	transformList = (data) => {
		return data.map((data, index) => {
			return {
				primary: data.name,
				primaryIcon: 'Quiz',
				key: `${data.name}${index}`,
				secondary: `${data.questions.length} Questions`
			};
		});
	};

	applySettingsFilter = (quizzes, settings) => {
		const disabled = {
			type: [],
			difficulty: []
		};
		[ 'MCQ', 'TF', 'MS', 'FC', 'FIB', 'Snippet' ].forEach(
			(type) => (settings[type] ? disabled.type.push(type) : void 0)
		);
		[ 'Beginner', 'Intermediate', 'Advanced' ].forEach(
			(type) => (settings[type] ? disabled.difficulty.push(type) : void 0)
		);

		quizzes = quizzes.map((quiz) => {
			quiz.filteredQuestions = quiz.questions.filter((question) => {
				let shouldReturn = true;
				shouldReturn = shouldReturn && !disabled.type.includes(question.type);
				shouldReturn = shouldReturn && !disabled.difficulty.includes(question.difficulty);
				shouldReturn =
					shouldReturn &&
					question.time_allocated <= settings.slider[1] &&
					question.time_allocated >= settings.slider[0];
				return shouldReturn;
			});
			return quiz;
		});
		if (settings.randomized_quiz) quizzes = arrayShuffler(quizzes);
		if (settings.randomized_question)
			quizzes = quizzes.map((quiz) => ({ ...quiz, questions: arrayShuffler(quiz.questions) }));
		return quizzes;
	};

	render() {
		const { quizzes, hasStarted } = this.state;

		return (
			<CustomList className="play_list" title={`Your quizzes`} listItems={this.transformList(quizzes)}>
				{({ list, checked }) => {
					return (
						<PlaySettings>
							{({ formData, inputs, slider }) => {
								const selectedQuizzes = checked.map((index) => quizzes[index]);

								const filteredQuizzes = this.applySettingsFilter(selectedQuizzes, {
									...formData.values,
									slider
								});

								let filteredQuestions = 0;
								for (let i = 0; i < filteredQuizzes.length; i++) {
									const filteredQuiz = filteredQuizzes[i];
									filteredQuestions += filteredQuiz.filteredQuestions.length;
								}

								return !hasStarted ? (
									<div className="play pages">
										{list}
										<PlayStats quizzes={quizzes} selectedQuizzes={filteredQuizzes} />
										<div className="play_button">
											<GenericButton
												text="Play"
												onClick={(e) =>
													checked.length !== 0 && filteredQuestions !== 0
														? this.setState({ hasStarted: true })
														: void 0}
											/>
										</div>
										{inputs}
									</div>
								) : (
									<Quiz
										settings={formData.values}
										quizzes={filteredQuizzes.map((filteredQuiz) => ({
											...filteredQuiz,
											questions: filteredQuiz.filteredQuestions
										}))}
									/>
								);
							}}
						</PlaySettings>
					);
				}}
			</CustomList>
		);
	}
}

export default Play;
