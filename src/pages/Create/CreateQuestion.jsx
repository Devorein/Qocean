import React, { Component } from 'react';
import * as Yup from 'yup';
import InputForm from '../../components/Form/InputForm';
import axios from 'axios';

const validationSchema = Yup.object({
	question: Yup.string('Enter the question').required('Question is required'),
	favourite: Yup.bool().default(false),
	public: Yup.bool().default(true),
	add_to_score: Yup.bool().default(true),
	quiz: Yup.string('Enter the quiz').required('Quiz is required'),
	type: Yup.string('Enter the type')
		.oneOf([ 'FIB', 'Snippet', 'MCQ', 'MS', 'FC', 'TF' ], 'Invalid question type')
		.required('Question type is required')
		.default('MCQ'),
	difficulty: Yup.string('Enter the difficulty')
		.oneOf([ 'Beginner', 'Intermediate', 'Advanced' ], 'Should be one of the required value')
		.default('Beginner'),
	time_allocated: Yup.number('Enter the time allocated')
		.min(15, 'Time allocated cant be less than 15 seconds')
		.max(120, 'Time allocated cant be more than 120 seconds')
		.default(30)
});

class CreateQuestion extends Component {
	state = {
		quizzes: [],
		loading: true
	};

	componentDidMount() {
		axios
			.get('http://localhost:5001/api/v1/quizzes/me?select=name&populate=false', {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			})
			.then(({ data: { data: quizzes } }) => {
				this.setState({
					quizzes,
					loading: false
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}

	render() {
		const { onSubmit } = this.props;
		const { quizzes, loading } = this.state;

		const inputs = [
			{ name: 'name' },
			{
				name: 'quiz',
				type: 'select',
				selectItems: quizzes.map(({ _id, name }) => {
					return {
						value: _id,
						text: name
					};
				}),
				disabled: quizzes.length < 1,
				helperText: loading
					? 'Loading your quizzes'
					: quizzes.length < 1 ? 'You have not created any quizzes yet' : null
			},
			{
				name: 'type',
				type: 'select',
				selectItems: [
					{ text: 'Fill In the Blanks', value: 'FIB' },
					{ text: 'Multiple Choice', value: 'MCQ' },
					{ text: 'Multiple Select', value: 'MS' },
					{ text: 'Snippet', value: 'Snippet' },
					{ text: 'Flashcard', value: 'FC' },
					{ text: 'True/False', value: 'TF' }
				],
				defaultValue: 'MCQ'
			},
			{
				name: 'difficulty',
				type: 'radio',
				radioItems: [
					{ label: 'Beginner', value: 'Beginner' },
					{ label: 'Intermediate', value: 'Intermediate' },
					{ label: 'Advanced', value: 'Advanced' }
				],
				defaultValue: 'Beginner'
			},
			{
				name: 'question_weight',
				type: 'number',
				inputProps: {
					min: 1,
					max: 10,
					step: 1
				},
				defaultValue: 1
			},
			{
				name: 'time_allocated',
				type: 'number',
				inputProps: {
					min: 15,
					max: 120,
					step: 5
				},
				defaultValue: 30
			},
			{ name: 'favourite', label: 'Favourite', type: 'checkbox', defaultValue: false },
			{ name: 'public', label: 'Public', type: 'checkbox', defaultValue: true },
			{ name: 'add_to_score', label: 'Add to Score', type: 'checkbox', defaultValue: true }
		];
		return (
			<div>
				<InputForm inputs={inputs} validationSchema={validationSchema} onSubmit={onSubmit} />
			</div>
		);
	}
}

export default CreateQuestion;