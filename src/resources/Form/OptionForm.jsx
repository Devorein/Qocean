import React, { Component } from 'react';
import InputForm from '../../components/Form/InputForm';
import * as Yup from 'yup';
import styled from 'styled-components';
import InputSelect from '../../components/Input/InputSelect';

const OptionFormContainer = styled.div`
	& .form {
		height: 100%;
		& .form-content {
			max-height: 100%;
			grid-area: 1/1/3/2;
		}
	}
`;

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

class OptionForm extends Component {
	state = {
		type: 'MCQ'
	};

	decideInputs = () => {
		const { type } = this.state;
		if (type === 'MCQ') return INIT_MCQ_STATE;
		else if (type === 'MS') return INIT_MS_STATE;
		else if (type === 'FC')
			return {
				answers: [
					{ name: 'answers', type: 'textarea', extra: { row: 4 } },
					{ name: 'alternate_1', type: 'textarea', extra: { row: 2 } },
					{ name: 'alternate_2', type: 'textarea', extra: { row: 2 } }
				],
				options: []
			};
		else if (type === 'Snippet')
			return {
				answers: [
					{ name: 'answers', type: 'textarea', extra: { row: 2 } },
					{ name: 'alternate_1', type: 'textarea', extra: { row: 1 } },
					{ name: 'alternate_2', type: 'textarea', extra: { row: 1 } }
				],
				options: []
			};
		else if (type === 'FIB')
			return {
				options: [],
				answers: [
					{ name: 'answers', type: 'textarea', extra: { row: 2 } },
					{ name: 'alternate_1', type: 'textarea', extra: { row: 1 } },
					{ name: 'alternate_2', type: 'textarea', extra: { row: 1 } }
				]
			};
		else if (type === 'TF')
			return {
				options: [],
				answers: [
					{
						name: 'answers',
						type: 'radio',
						extra: {
							radioItems: [ { value: 'answer_1', label: 'True' }, { value: 'answer_2', label: 'False' } ]
						},
						defaultValue: 'answer_1'
					}
				]
			};
	};

	decideValidation = () => {
		const { type } = this.state;
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

	typeChangeHandler = (e) => {
		this.setState({
			type: e.target.value
		});
	};

	render() {
		const { typeChangeHandler, decideValidation, decideInputs } = this;
		const validationSchema = decideValidation();
		const { options, answers } = decideInputs();

		return (
			<InputForm
				passFormAsProp={true}
				validationSchema={validationSchema}
				errorBeforeTouched={true}
				validateOnMount={true}
				inputs={[ ...options, ...answers ]}
				formButtons={false}
			>
				{({ values, errors, isValid, inputs }) => {
					return this.props.children({
						form: <OptionFormContainer className="answers_form">{inputs}</OptionFormContainer>,
						formData: {
							values,
							errors,
							isValid
						},
						select: {
							type: 'component',
							component: (
								<InputSelect
									key="question_type"
									name="type"
									selectItems={[
										{ text: 'Multiple Choice', value: 'MCQ' },
										{ text: 'Multiple Select', value: 'MS' },
										{ text: 'Fill In the Blanks', value: 'FIB' },
										{ text: 'Snippet', value: 'Snippet' },
										{ text: 'Flashcard', value: 'FC' },
										{ text: 'True/False', value: 'TF' }
									]}
									value={this.state.type}
									onChange={typeChangeHandler}
								/>
							)
						}
					});
				}}
			</InputForm>
		);
	}
}

export default OptionForm;
