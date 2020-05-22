import React, { Component } from 'react';
import * as Yup from 'yup';
import InputForm from '../../components/Form/InputForm';
import axios from 'axios';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import LinkIcon from '@material-ui/icons/Link';
import PublishIcon from '@material-ui/icons/Publish';
import UploadButton from '../../components/Buttons/UploadButton';
import CustomTabs from '../../components/Tab/Tabs';

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
	null,
	null,
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
		image: 'link',
		file: null,
		input: null,
		options: {
			type: 'group',
			name: 'options',
			children: [ { name: 'option_1' }, { name: 'option_2' }, { name: 'option_3' } ],
			treeView: true
		},
		answers: {
			name: 'answers',
			type: 'radio',
			radioItems: [
				{ value: 'answer_1', label: 'Answer 1' },
				{ value: 'answer_2', label: 'Answer 2' },
				{ value: 'answer_3', label: 'Answer 3' }
			],
			defaultValue: 'answer_1'
		},
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

	typeChangeHandler = (values, setValues, e) => {
		const { name, value } = e.target;
		if (name === 'type') {
			if (value === 'MCQ')
				this.setState({
					options: {
						type: 'group',
						name: 'options',
						children: [ { name: 'option_1' }, { name: 'option_2' }, { name: 'option_3' } ],
						treeView: true
					},
					answers: {
						name: 'answers',
						type: 'radio',
						radioItems: [
							{ value: 'answer_1', label: 'Answer 1' },
							{ value: 'answer_2', label: 'Answer 2' },
							{ value: 'answer_3', label: 'Answer 3' }
						],
						defaultValue: 'answer_1'
					},
					showButton: true,
					type: value
				});
			else if (value === 'MS')
				this.setState({
					options: {
						type: 'group',
						name: 'options',
						children: [ { name: 'option_1' }, { name: 'option_2' }, { name: 'option_3' } ],
						treeView: true
					},
					answers: {
						type: 'group',
						name: 'answers',
						treeView: false,
						children: [
							{ name: 'answer_1', type: 'checkbox' },
							{ name: 'answer_2', type: 'checkbox' },
							{ name: 'answer_3', type: 'checkbox' }
						]
					},
					showButton: true,
					type: value
				});
			else if (value === 'FC') {
				values.answers = '';
				setValues({ ...values });
				this.setState({
					answers: { name: 'answers', type: 'textarea' },
					options: null,
					showButton: false,
					type: value
				});
			} else if (value === 'TF') {
				Object.entries(values).forEach(([ key, value ]) => {
					if (key.startsWith('option_')) delete values[key];
				});
				values.answers = 'true';
				setValues({ ...values });
				this.setState({
					options: null,
					answers: {
						name: 'answers',
						type: 'radio',
						radioItems: [ { label: 'True', value: 'true' }, { label: 'False', value: 'false' } ],
						defaultValue: 'true'
					},
					showButton: false,
					type: value
				});
			} else if (value === 'FIB') {
				this.setState({
					options: null,
					answers: {},
					showButton: false,
					type: value
				});
			} else if (value === 'Snippet') {
				values.answers = '';
				setValues({ ...values });
				this.setState({
					options: null,
					answers: { name: 'answers' },
					showButton: false,
					type: value
				});
			}
		}
	};

	/* addOption = () => {
		let { options, type, answers } = this.state;
		options = [ ...options, { name: `option_${options.length + 1}`, endAdornment: [ 'close', this.removeOption ] } ];

		if (type === 'MCQ') {
			answers = [
				{
					name: 'answers',
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
					name: 'answers',
					type: 'radio',
					radioItems: answers[0].radioItems
						.filter((answer) => answer.value.replace('answer', 'option') !== name)
						.map((answer, index) => {
							return { label: `Answer ${index + 1}`, value: `answer_${index + 1}` };
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
	}; */

	decideValidation = (type) => {
		const validationSchema = {
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
		};

		if (type === 'MCQ') {
			return Yup.object({
				...validationSchema,
				option_1: Yup.string('Enter option 1').required('Option 1 is required'),
				option_2: Yup.string('Enter option 2').required('Option 2 is required'),
				option_3: Yup.string('Enter option 3').required('Option 3 is required'),
				answers: Yup.string('Enter answer')
					.oneOf([ 'answer_1', 'answer_2', 'answer_3', 'answer_4', 'answer_5', 'answer_6' ])
					.required('An answer must be choosen')
			});
		} else if (type === 'MS')
			return Yup.object({
				...validationSchema,
				option_1: Yup.string('Enter option 1').required('Option 1 is required'),
				option_2: Yup.string('Enter option 2').required('Option 2 is required'),
				option_3: Yup.string('Enter option 3').required('Option 3 is required')
			});
		else if (type === 'Snippet')
			return Yup.object({
				...validationSchema,
				answers: Yup.string('Enter answer').required('Answer is required')
			});
		else if (type === 'FC') {
			return Yup.object({
				...validationSchema,
				answers: Yup.string('Enter answer').required('An answer must be given')
			});
		} else if (type === 'TF') {
			return Yup.object({
				...validationSchema,
				answers: Yup.string('Enter answer')
					.oneOf([ 'true', 'false' ], 'Should be either true or false')
					.required('An answer must be given')
			});
		} else if (type === 'FIB') {
			return Yup.object({
				...validationSchema,
				answers: Yup.string('Enter answer')
					.oneOf([ 'true', 'false' ], 'Should be either true or false')
					.required('An answer must be given')
			});
		}
	};

	preSubmit = (values) => {
		const { type } = this.state;
		if (type === 'MCQ') {
			const options = [];
			Object.entries(values).forEach(([ key, value ]) => {
				if (key.startsWith('option_')) {
					options.push(value);
					delete values[key];
				}
			});
			values.options = options;
			values.answers = parseInt(values.answers.split('_')[1]);
			return values;
		} else if (type === 'MS') {
			const options = [];
			const answers = [];
			Object.entries(values).forEach(([ key, value ]) => {
				if (key.startsWith('option_')) {
					options.push(value);
					delete values[key];
				} else if (key.startsWith('answer_')) {
					answers.push(answers.length + 1);
					delete values[key];
				}
			});
			values.options = options;
			values.answers = answers.map((answer) => [ parseInt(answer) ]);
			return values;
		} else if (type === 'Snippet') {
			Object.entries(values).forEach(([ key, value ]) => {
				if (key.startsWith('option')) delete values[key];
			});
			values.answers = [ [ values.answers ] ];
			return values;
		} else if (type === 'FC') {
			Object.entries(values).forEach(([ key, value ]) => {
				if (key.startsWith('option')) delete values[key];
			});
			values.answers = [ [ values.answers ] ];
			return values;
		} else if (type === 'TF') {
			Object.entries(values).forEach(([ key, value ]) => {
				if (key.startsWith('option')) delete values[key];
			});
			values.answers = [ [ values.answers ] ];
			values.options = [ 'True', 'False' ];
			return values;
		}
		if (this.state.file) values.link = '';
	};

	postSubmit = ({ data }) => {
		const fd = new FormData();

		if (this.state.file) {
			fd.append('file', this.state.file, this.state.file.name);
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
					}, this.props.user.current_environment.notification_timing);
				})
				.catch((err) => {
					setTimeout(() => {
						this.props.changeResponse(`An error occurred`, err.response.data.error, 'error');
					}, this.props.user.current_environment.notification_timing);
				});
		} else this.resetForm(null);
	};

	switchImageHandler = (value) => {
		this.setState({
			image: value.name
		});
	};

	setFile = (e) => {
		e.persist();
		const { files: [ file ] } = e.target;
		this.setState({
			file
		});
	};

	render() {
		const { typeChangeHandler, decideValidation, preSubmit, postSubmit, switchImageHandler, setFile } = this;
		const { onSubmit } = this.props;
		const { type, quizzes, loading, options, answers, showButton, image } = this.state;
		const validationSchema = decideValidation(type);

		const headers = [ { name: 'link', icon: <LinkIcon /> }, { name: 'upload', icon: <PublishIcon /> } ];

		const index = headers.findIndex(({ name }) => name === this.state.image);

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
		inputs[3] = options;
		inputs[4] = answers;
		inputs[5].siblings = [
			{
				name: 'Image',
				type: 'group',
				treeView: true,
				children: [
					{
						type: 'component',
						component: (
							<CustomTabs
								value={index === -1 ? 0 : index}
								onChange={(e, value) => {
									switchImageHandler(headers[value]);
								}}
								key={'image_tabs'}
								indicatorColor="primary"
								textColor="primary"
								centered
								headers={headers}
							/>
						)
					},
					image === 'link'
						? { name: 'link' }
						: {
								type: 'component',
								component: <UploadButton key={'upload'} setFile={setFile} inputRef={(input) => (this.input = input)} />
							}
				]
			}
		];
		return (
			<div className="create_question create_form page">
				<InputForm
					inputs={inputs}
					customHandler={typeChangeHandler}
					validationSchema={validationSchema}
					onSubmit={onSubmit.bind(null, [ preSubmit, postSubmit ])}
				/>
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					{showButton && options.length < 6 ? <AddCircleIcon color={'primary'} onClick={this.addOption} /> : null}
				</div>
			</div>
		);
	}
}

// Client side Schema validation
// Alternate
// Form Submission
// Backend question Validation

export default CreateQuestion;
