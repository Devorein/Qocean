import React, { Component } from 'react';
import InputForm from '../../components/Form/InputForm';
import * as Yup from 'yup';

const INIT_MCQ_STATE = {
	options: [
		{
			type: 'group',
			name: 'options',
			children: [ { name: 'option_1' }, { name: 'option_2' }, { name: 'option_3' } ],
			extra: { treeView: true }
		},
		{
			type: 'group',
			name: 'additional_options',
			children: [ { name: 'option_4' }, { name: 'option_5' }, { name: 'option_6' } ],
			extra: { treeView: true, collapse: true }
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
					{ value: 'answer_3', label: 'Answer 3' },
					{ value: 'answer_4', label: 'Answer 4' },
					{ value: 'answer_5', label: 'Answer 5' },
					{ value: 'answer_6', label: 'Answer 6' }
				]
			},
			defaultValue: 'answer_1'
		}
	]
};

const INIT_MS_STATE = {
	options: [
		{
			type: 'group',
			name: 'options',
			children: [ { name: 'option_1' }, { name: 'option_2' }, { name: 'option_3' } ],
			extra: { treeView: true }
		},
		{
			type: 'group',
			name: 'additional_options',
			children: [ { name: 'option_4' }, { name: 'option_5' }, { name: 'option_6' } ],
			extra: { treeView: true, collapse: true }
		}
	],
	answers: [
		{
			type: 'group',
			name: 'answers',
			extra: { treeView: false },
			children: [
				{ name: 'answer_1', type: 'checkbox' },
				{ name: 'answer_2', type: 'checkbox' },
				{ name: 'answer_3', type: 'checkbox' },
				{ name: 'answer_4', type: 'checkbox' },
				{ name: 'answer_5', type: 'checkbox' },
				{ name: 'answer_6', type: 'checkbox' }
			]
		}
	]
};

class QuestionForm extends Component {
	state = {
		...INIT_MCQ_STATE
	};

	decideInputs = (type) => {
		const validateForm = () => {
			this.InputForm.Form.props.validateForm().then((error) => {
				this.InputForm.Form.props.setErrors(error);
			});
		};
		if (type === 'MCQ') {
			this.setState(INIT_MCQ_STATE, validateForm);
		} else if (type === 'MS') {
			this.setState(INIT_MS_STATE, validateForm);
		} else if (type === 'FC') {
			this.setState(
				{
					answers: [
						{ name: 'answers', type: 'textarea', extra: { row: 4 } },
						{ name: 'alternate', type: 'textarea', extra: { row: 4 } }
					],
					options: []
				},
				validateForm
			);
		} else if (type === 'Snippet') {
			this.setState(
				{
					answers: [
						{ name: 'answers', type: 'textarea', extra: { row: 2 } },
						{ name: 'alternate_1', type: 'textarea', extra: { row: 1 } },
						{ name: 'alternate_2', type: 'textarea', extra: { row: 1 } }
					],
					options: []
				},
				validateForm
			);
		} else if (type === 'FIB') {
			return [];
		} else if (type === 'TF') {
			this.setState(
				{
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
				},
				validateForm
			);
		}
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
				if (key.startsWith('option_') && value !== '') options.push(value);
			});
			values.options = options;
			values.answers = parseInt(form.answers.split('_')[1]);
		} else if (type === 'MS') {
			const options = [];
			const answers = [];
			Object.entries(form).forEach(([ key, value ]) => {
				if (key.startsWith('option_') && value !== '') options.push(value);
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
			<div className="answers_form">
				<InputForm
					validationSchema={validationSchema}
					errorBeforeTouched={true}
					validateOnMount={true}
					inputs={[ ...options, ...answers ]}
					formButtons={false}
					ref={(i) => (this.InputForm = i)}
				/>
			</div>
		);
	}
}

// Backend question Validation

export default QuestionForm;
