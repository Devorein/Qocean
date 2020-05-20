import React, { Component } from 'react';
import * as Yup from 'yup';
import InputForm from '../../components/Form/InputForm';
import axios from 'axios';
import AddCircleIcon from '@material-ui/icons/AddCircle';

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

const inputs = [
	{ name: 'name' },
	{},
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

class CreateQuestion extends Component {
	state = {
		quizzes: [],
		loading: true,
		type: 'MCQ',
		options: [ { name: 'option_1' }, { name: 'option_2' }, { name: 'option_3' } ],
		answers: [
			{
				name: 'Answer',
				type: 'radio',
				radioItems: [
					{ label: 'Answer 1', value: 'answer_1' },
					{ label: 'Answer 2', value: 'answer_2' },
					{ label: 'Answer 3', value: 'answer_3' }
				],
				defaultValue: 'answer_1'
			}
		],
		showButton: true
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

	typeChangeHandler = (e) => {
		const { name, value } = e.target;
		if (name === 'type') {
			if (value === 'MCQ')
				this.setState({
					options: [ { name: 'option_1' }, { name: 'option_2' }, { name: 'option_3' } ],
					answers: [
						{
							name: 'Answer',
							type: 'radio',
							radioItems: [
								{ label: 'answer_1', value: 'Answer 1' },
								{ label: 'answer_2', value: 'Answer 2' },
								{ label: 'answer_3', value: 'Answer 3' }
							],
							defaultValue: 'Answer 1'
						}
					],
					showButton: true
				});
			else if (value === 'MS')
				this.setState({
					options: [ { name: 'option_1' }, { name: 'option_2' }, { name: 'option_3' } ],
					answers: [
						{ name: 'answer_1', type: 'checkbox' },
						{ name: 'answer_2', type: 'checkbox' },
						{ name: 'answer_3', type: 'checkbox' }
					],
					showButton: true
				});
			else if (value === 'FC')
				this.setState({
					answers: [ { name: 'answer', type: 'textarea' } ],
					options: [],
					showButton: false
				});
			else if (value === 'TF')
				this.setState({
					options: [
						{
							name: 'Answer',
							type: 'radio',
							radioItems: [ { label: 'True', value: 'true' }, { label: 'False', value: 'false' } ],
							defaultValue: 'true'
						}
					],
					answers: [],
					showButton: false
				});
			else if (value === 'FIB') {
				this.setState({
					options: [],
					answers: [],
					showButton: false
				});
			} else if (value === 'Snippet') {
				this.setState({
					options: [],
					answers: [ { name: 'answer' } ],
					showButton: false
				});
			}
			this.setState({
				type: value
			});
		}
	};

	addOption = () => {
		let { options, type, answers } = this.state;
		options = [ ...options, { name: `option_${options.length + 1}`, endAdornment: [ 'close', this.removeOption ] } ];

		if (type === 'MCQ') {
			answers = [
				{
					name: 'Answer',
					type: 'radio',
					radioItems: [
						...answers[0].radioItems,
						{
							label: `Answer ${answers[0].radioItems.length + 1}`,
							value: `answer_${answers[0].radioItems.length + 1}`
						}
					]
				}
			];
		} else if (type === 'MS') answers = [ ...answers, { name: `answer_${answers.length + 1}`, type: 'checkbox' } ];

		this.setState({
			options,
			answers
		});
	};

	removeOption = (name, e) => {
		let { options, type, answers } = this.state;
		options = options.filter((option) => option.name !== name).map((option, index) => {
			return { ...option, name: `option_${index + 1}` };
		});
		if (type === 'MCQ') {
			answers = [
				{
					name: 'Answer',
					type: 'radio',
					radioItems: answers[0].radioItems
						.filter((answer) => answer.name.replace('answer', 'option') !== name)
						.map((answer, index) => {
							return { ...answer, name: `answer_${index + 1}` };
						})
				}
			];
		} else if (type === 'MS') {
			answers = answers.filter((answer) => answer.name.replace('answer', 'option') !== name).map((answer, index) => {
				return { ...answer, name: `answer_${index + 1}` };
			});
		}

		this.setState({
			options,
			answers
		});
	};

	decideValidation = (type) => {
		if (type === 'MCQ') {
			return Yup.object({
				option_1: Yup.string('Enter option 1').required('Option 1 is required'),
				option_2: Yup.string('Enter option 2').required('Option 2 is required'),
				option_3: Yup.string('Enter option 3').required('Option 3 is required')
			});
		}
	};

	render() {
		const { typeChangeHandler } = this;
		const { onSubmit, changeResponse } = this.props;
		const { type, quizzes, loading, options, answers, showButton } = this.state;
		const optionsValidation = this.decideValidation(type);
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
			<div className="create_question page">
				<InputForm
					inputs={inputs}
					customHandler={typeChangeHandler}
					validationSchema={validationSchema}
					onSubmit={onSubmit.bind(null, [ changeResponse ])}
				/>

				<InputForm inputs={[ ...options, ...answers ]} formButtons={false} validationSchema={optionsValidation}>
					<div style={{ display: 'flex', justifyContent: 'center' }}>
						{showButton && options.length < 6 ? <AddCircleIcon color={'primary'} onClick={this.addOption} /> : null}
					</div>
				</InputForm>
			</div>
		);
	}
}

// Client side Schema validation
// Alternate
// Form Submission
// Backend question Validation

export default CreateQuestion;
