import React, { Component } from 'react';
import * as Yup from 'yup';
import InputForm from '../../components/Form/InputForm';
import axios from 'axios';
import FileInput from '../../components/Input/FileInput';
import QuestionForm from './QuestionForm';

const inputs = [
	{ name: 'question' },
	null,
	{
		name: 'type',
		type: 'select',
		selectItems: [
			{ text: 'Multiple Choice', value: 'MCQ' },
			{ text: 'Multiple Select', value: 'MS' },
			{ text: 'Fill In the Blanks', value: 'FIB' },
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

class CreateQuestion extends Component {
	state = {
		quizzes: [],
		loading: true,
		type: 'MCQ'
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

	typeChangeHandler = (values, setValues, e) => {
		const { name, value } = e.target;
		if (name === 'type') {
			this.setState({
				type: value
			});
		}
	};

	preSubmit = (values) => {
		return values;
	};

	postSubmit = ({ data }) => {
		const fd = new FormData();
		const [ file ] = this.refs.FileInput.returnData();
		if (file) {
			fd.append('file', file, file.name);
			axios
				.put(`http://localhost:5001/api/v1/questions/${data.data._id}/photo`, fd, {
					headers: {
						'Content-Type': 'multipart/form-data',
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				})
				.then((data) => {
					setTimeout(() => {
						this.props.changeResponse(`Uploaded`, `Successsfully uploaded image for the question`, 'success');
					}, this.props.user.current_environment.notification_timing + 500);
				})
				.catch((err) => {
					setTimeout(() => {
						this.props.changeResponse(`An error occurred`, err.response.data.error, 'error');
					}, this.props.user.current_environment.notification_timing + 500);
				});
		} else this.resetForm(null);
	};

	render() {
		const { typeChangeHandler, preSubmit, postSubmit } = this;
		const { onSubmit } = this.props;
		const { type, quizzes, loading } = this.state;
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

		inputs[1] = {
			name: 'quiz',
			type: 'select',
			selectItems: quizzes.map(({ _id, name }) => {
				return {
					value: _id,
					text: name
				};
			}),
			disabled: quizzes.length < 1,
			helperText: loading ? 'Loading your quizzes' : quizzes.length < 1 ? 'You have not created any quizzes yet' : null
		};

		return (
			<div className="create_question create_form page">
				<QuestionForm type={type} />
				<InputForm
					inputs={inputs}
					customHandler={typeChangeHandler}
					validationSchema={validationSchema}
					onSubmit={onSubmit.bind(null, [ preSubmit, postSubmit ])}
				/>
				<FileInput ref="FileInput" />
			</div>
		);
	}
}

export default CreateQuestion;
