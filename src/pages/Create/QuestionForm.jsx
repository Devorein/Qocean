import React, { Component } from 'react';
import InputForm from '../../components/Form/InputForm';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import * as Yup from 'yup';

class QuestionForm extends Component {
	state = {
		options: [
			{
				type: 'group',
				name: 'options',
				children: [ { name: 'option_1' }, { name: 'option_2' }, { name: 'option_3' } ],
				treeView: true
			}
		],
		answers: [
			{
				name: 'answers',
				type: 'radio',
				extra: {
					radioItems: [
						{ value: 'answer_1', label: 'Answer 1' },
						{ value: 'answer_2', label: 'Answer 2' },
						{ value: 'answer_3', label: 'Answer 3' }
					]
				},
				defaultValue: 'answer_1'
			}
		],
		showButton: true
	};

	decideInputs = (type) => {
		if (type === 'MCQ') {
			this.setState({
				options: [
					{
						type: 'group',
						name: 'options',
						children: [ { name: 'option_1' }, { name: 'option_2' }, { name: 'option_3' } ],
						treeView: true
					}
				],
				answers: [
					{
						name: 'answers',
						type: 'radio',
						extra: {
							radioItems: [
								{ value: 'answer_1', label: 'Answer 1' },
								{ value: 'answer_2', label: 'Answer 2' },
								{ value: 'answer_3', label: 'Answer 3' }
							]
						},
						defaultValue: 'answer_1'
					}
				]
			});
		} else if (type === 'MS') {
			this.setState({
				options: [
					{
						type: 'group',
						name: 'options',
						children: [ { name: 'option_1' }, { name: 'option_2' }, { name: 'option_3' } ],
						treeView: true
					}
				],
				answers: [
					{
						type: 'group',
						name: 'answers',
						treeView: false,
						children: [
							{ name: 'answer_1', type: 'checkbox' },
							{ name: 'answer_2', type: 'checkbox' },
							{ name: 'answer_3', type: 'checkbox' }
						]
					}
				]
			});
		} else if (type === 'FC') {
			this.setState({
				answers: [
					{ name: 'answers', type: 'textarea', extra: { row: 4 } },
					{ name: 'alternate', type: 'textarea', extra: { row: 4 } }
				],
				options: []
			});
		} else if (type === 'Snippet') {
			this.setState({
				answers: [
					{ name: 'answers', type: 'textarea', extra: { row: 2 } },
					{ name: 'alternate_1', type: 'textarea', extra: { row: 1 } },
					{ name: 'alternate_2', type: 'textarea', extra: { row: 1 } }
				],
				options: []
			});
		} else if (type === 'FIB') {
			return [];
		} else if (type === 'TF') {
			this.setState({
				options: [],
				answers: [
					{
						name: 'answers',
						type: 'radio',
						extra: {
							radioItems: [ { label: 'True', value: 'true' }, { label: 'False', value: 'false' } ]
						},
						defaultValue: 'true'
					}
				]
			});
		}
	};

	/* 	addOption = () => {
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

	showButton = (type) => {
		if (type === 'MCQ' || type === 'MS') return true;
		else return false;
	};

	decideValidation = (type) => {
		if (type === 'MCQ') {
			return Yup.object({
				option_1: Yup.string('Enter option 1').required('Option 1 is required'),
				option_2: Yup.string('Enter option 2').required('Option 2 is required'),
				option_3: Yup.string('Enter option 3').required('Option 3 is required'),
				answers: Yup.string('Enter answer')
					.oneOf([ 'answer_1', 'answer_2', 'answer_3', 'answer_4', 'answer_5', 'answer_6' ])
					.required('An answer must be choosen')
			});
		} else if (type === 'MS')
			return Yup.object({
				option_1: Yup.string('Enter option 1').required('Option 1 is required'),
				option_2: Yup.string('Enter option 2').required('Option 2 is required'),
				option_3: Yup.string('Enter option 3').required('Option 3 is required')
			});
		else if (type === 'Snippet')
			return Yup.object({
				answers: Yup.string('Enter answer').required('Answer is required')
			});
		else if (type === 'FC') {
			return Yup.object({
				answers: Yup.string('Enter answer').required('An answer must be given')
			});
		} else if (type === 'TF') {
			return Yup.object({
				answers: Yup.string('Enter answer')
					.oneOf([ 'true', 'false' ], 'Should be either true or false')
					.required('An answer must be given')
			});
		} else if (type === 'FIB') {
			return Yup.object({
				answers: Yup.string('Enter answer')
					.oneOf([ 'true', 'false' ], 'Should be either true or false')
					.required('An answer must be given')
			});
		}
	};

	transformValue = (values) => {
		const { type } = this.props;
		const form = this.InputForm.Form.props.values;
		if (type === 'MCQ') {
			const options = [];
			Object.entries(form).forEach(([ key, value ]) => {
				if (key.startsWith('option_')) options.push(value);
			});
			values.options = options;
			values.answers = parseInt(form.answers.split('_')[1]);
		} else if (type === 'MS') {
			const options = [];
			const answers = [];
			Object.entries(form).forEach(([ key, value ]) => {
				if (key.startsWith('option_')) options.push(value);
				else if (key.startsWith('answer_')) answers.push(answers.length + 1);
			});
			values.options = options;
			values.answers = answers.map((answer) => [ parseInt(answer) ]);
		} else if (type === 'Snippet') {
			values.answers = [ [ form.answers ] ];
			if (form.alternate_1) values.answers[0].push(form.alternate_1);
			if (form.alternate_2) values.answers[0].push(form.alternate_2);
		} else if (type === 'FC') {
			values.answers = [ [ form.answers ] ];
			if (form.alternate) values.answers[0].push(form.alternate);
		} else if (type === 'TF') values.answers = [ [ values.answers ] ];
		return values;
	};

	render() {
		const { type } = this.props;
		const { options, answers } = this.state;
		const validationSchema = this.decideValidation(type);
		return (
			<div className="question_form">
				<InputForm
					validationSchema={validationSchema}
					errorBeforeTouched={true}
					validateOnMount={true}
					inputs={[ ...options, ...answers ]}
					formButtons={false}
					ref={(i) => (this.InputForm = i)}
				/>
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					{this.showButton(type) && options.length < 6 ? (
						<AddCircleIcon color={'primary'} onClick={this.addOption} />
					) : null}
				</div>
			</div>
		);
	}
}

// Client side Schema validation
// Alternate
// Form Submission
// Backend question Validation

export default QuestionForm;
