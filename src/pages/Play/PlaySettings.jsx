import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import InputForm from '../../components/Form/InputForm';
import arrayShuffler from '../../Utils/arrayShuffler';
import GenericButton from '../../components/Buttons/GenericButton';

const inputs = [
	{ name: 'session_name', defaultValue: Date.now().toString() },
	{
		name: 'validation',
		type: 'select',
		extra: {
			selectItems: [
				{
					text: 'After every question',
					value: 'instant'
				},
				{
					text: 'End of session',
					value: 'end'
				}
			]
		},
		defaultValue: 'end'
	},
	{
		name: 'disable_by_time_allocated',
		type: 'slider',
		defaultValue: [ 15, 60 ]
	},
	{
		name: 'disable_by_difficulty',
		type: 'group',
		extra: { treeView: true },
		children: [ 'Beginner', 'Intermediate', 'Advanced' ].map((item) => {
			return {
				name: item,
				type: 'checkbox',
				defaultValue: false
			};
		})
	},
	{
		name: 'disable_by_type',
		type: 'group',
		extra: { treeView: true },
		children: [ 'MCQ', 'MS', 'TF', 'Snippet', 'FC', 'FIB' ].map((item) => {
			return {
				name: item,
				type: 'checkbox',
				defaultValue: false
			};
		})
	},
	{
		name: 'randomize',
		type: 'group',
		extra: { treeView: true },
		children: [
			{
				type: 'checkbox',
				name: 'randomized_quiz',
				defaultValue: false
			},
			{
				type: 'checkbox',
				name: 'randomized_question',
				defaultValue: false
			},
			{
				type: 'checkbox',
				name: 'randomized_options',
				defaultValue: false
			}
		]
	}
];

class PlaySettings extends Component {
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

	render() {
		const { selectedQuizIds, quizzes, history, match } = this.props;
		const selectedQuizzes = selectedQuizIds.map((selectedQuizId) =>
			quizzes.find((quiz) => quiz._id === selectedQuizId)
		);

		return (
			<InputForm formButtons={false} inputs={inputs} passFormAsProp>
				{({ setValues, values, errors, isValid, inputs }) => {
					const filteredQuizzes = this.applySettingsFilter(selectedQuizzes, {
						...values
					});

					let filteredQuestions = 0;
					for (let i = 0; i < filteredQuizzes.length; i++) {
						const filteredQuiz = filteredQuizzes[i];
						filteredQuestions += filteredQuiz.filteredQuestions.length;
					}
					return this.props.children({
						formData: {
							values,
							errors,
							isValid
						},
						inputs: (
							<div className="play_settings">
								{inputs}
								<div className="play_button">
									<GenericButton
										text="Play"
										onClick={(e) => {
											if (selectedQuizIds.length !== 0 && filteredQuestions !== 0) history.push(match.url + '/quiz');
										}}
									/>
								</div>
							</div>
						),
						setValues,
						selectedQuizzes,
						filteredQuizzes
					});
				}}
			</InputForm>
		);
	}
}

export default withRouter(PlaySettings);
