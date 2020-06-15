import React, { Component } from 'react';
import axios from 'axios';

import DataFetcher from '../../components/DataFetcher/DataFetcher';
import Explorer from '../../components/Explorer/Explorer';
import CustomList from '../../components/List/List';
import PlayStats from './PlayStats';
import PlaySettings from './PlaySettings';
import GenericButton from '../../components/Buttons/GenericButton';
import Quiz from '../Start/Quiz';
import arrayShuffler from '../../Utils/arrayShuffler';
import DeleteIcon from '@material-ui/icons/Delete';

import './Play.scss';

class Play extends Component {
	state = {
		quizzes: [],
		hasStarted: false,
		playsettings: null,
		selectedQuizIds: []
	};

	componentDidMount() {
		axios
			.get(`http://localhost:5001/api/v1/quizzes/me?populate=questions&populateFields=type,difficulty,time_allocated`, {
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

	transformList = () => {
		const { selectedQuizIds, quizzes } = this.state;

		return selectedQuizIds.map((id) => {
			const quiz = quizzes.find((quiz) => quiz._id === id);
			return {
				_id: quiz._id,
				primary: quiz.name,
				primaryIcon: 'Quiz',
				secondary: `${quiz.questions.length} Questions`
			};
		});
	};

	onDelete = (_ids) => {
		const { selectedQuizIds } = this.state;
		_ids.forEach((_id) => {
			selectedQuizIds.splice(selectedQuizIds.indexOf(_id), 1);
		});
		this.setState({
			selectedQuizIds
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
					question.time_allocated <= settings.disable_by_time_allocated[1] &&
					question.time_allocated >= settings.disable_by_time_allocated[0];
				return shouldReturn;
			});
			return quiz;
		});
		if (settings.randomized_quiz) quizzes = arrayShuffler(quizzes);
		if (settings.randomized_question)
			quizzes = quizzes.map((quiz) => ({ ...quiz, questions: arrayShuffler(quiz.questions) }));
		return quizzes;
	};

	addToBucketList = (selectedIds) => {
		const { selectedQuizIds } = this.state;
		selectedIds.forEach((selectedId) => {
			const index = selectedQuizIds.indexOf(selectedId);
			if (index === -1) selectedQuizIds.push(selectedId);
			else selectedQuizIds.splice(index, 1);
		});
		this.setState({
			selectedQuizIds
		});
	};

	render() {
		const { hasStarted, selectedQuizIds } = this.state;

		return (
			<DataFetcher page="Play">
				{({ data: quizzes, totalCount, refetchData }) => {
					return (
						<CustomList
							className="play_list"
							listItems={this.transformList()}
							icons={[
								{
									icon: DeleteIcon,
									onClick: this.onDelete
								}
							]}
						>
							{({ list }) => {
								return (
									<PlaySettings>
										{({ formData, inputs, slider }) => {
											const selectedQuizzes = selectedQuizIds.map((selectedQuizId) =>
												quizzes.find((quiz) => quiz._id === selectedQuizId)
											);
											console.log(selectedQuizzes);

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
													<Explorer
														page={'Play'}
														data={quizzes.map((item) => ({
															...item,
															added: selectedQuizIds.includes(item._id)
														}))}
														totalCount={totalCount}
														type={'Quiz'}
														refetchData={refetchData.bind(null, 'Quiz')}
														hideDetailer
														customHandlers={{
															add: this.addToBucketList
														}}
													/>
													{list}
													<PlayStats quizzes={quizzes} selectedQuizzes={selectedQuizzes} />
													<div className="play_button">
														<GenericButton
															text="Play"
															onClick={(e) =>
																selectedQuizIds.length !== 0 && filteredQuestions !== 0
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
				}}
			</DataFetcher>
		);
	}
}

export default Play;
