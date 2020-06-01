import React, { Component } from 'react';
import InputForm from '../../components/Form/InputForm';
import * as Yup from 'yup';
import styled from 'styled-components';
import InputSelect from '../../components/Input/InputSelect';
import TextField from '@material-ui/core/TextField';

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
		type: 'MCQ',
		blank_count: 1,
		FIB_data: Array(5).fill(0).map((_) => ({ answers: '', alternate1: '', alternate2: '' }))
	};

	renderFIB = () => {
		const options = [];
		for (let i = 1; i <= this.state.blank_count; i++) {
			const FIB_DATA = this.state.FIB_data[i - 1];
			options.push(
				{ name: `answers_${i}`, extra: { row: 2 }, defaultValue: FIB_DATA.answers },
				{
					name: `alternate_${i}_1`,
					extra: { row: 1 },
					defaultValue: FIB_DATA.alternate1
				},
				{
					name: `alternate_${i}_2`,
					extra: { row: 1 },
					defaultValue: FIB_DATA.alternate2
				}
			);
		}
		return options;
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
		else if (type === 'FIB') {
			const INIT_FIB_STATE = {
				options: [],
				answers: [
					{
						type: 'component',
						component: (
							<TextField
								key="blank_count"
								type={'number'}
								value={this.state.blank_count}
								onChange={(e) => this.setState({ blank_count: e.target.value })}
								fullWidth
								inputProps={{ max: 5, min: 1, step: 1 }}
							/>
						)
					}
				]
			};
			INIT_FIB_STATE.answers = INIT_FIB_STATE.answers.slice(0, 1);
			INIT_FIB_STATE.answers.push(...this.renderFIB());
			return INIT_FIB_STATE;
		} else if (type === 'TF')
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
					.oneOf([ 'answer_1', 'answer_2' ], 'Should be either true or false')
					.required('An answer must be given')
					.default('answer_1')
			});
		} else if (type === 'FIB') {
			const obj = {};
			for (let i = 1; i <= this.state.blank_count; i++)
				obj[`answers_${i}`] = Yup.string(`Enter answer ${i}`).required('An answer must be given');
			return Yup.object(obj);
		}
	};

	transformValues = (source, dest) => {
		const { type } = this.state;
		dest.type = type;
		if (type === 'MCQ') {
			const options = [];
			Object.entries(source).forEach(([ key, value ]) => {
				if (key.startsWith('option_') && value !== '') options.push(value);
			});
			dest.options = options;
			dest.answers = [ parseInt(source.answers.split('_')[1]) - 1 ];
		} else if (type === 'MS') {
			const options = [];
			const answers = [];
			let index = 0;
			Object.entries(source).forEach(([ key, value ]) => {
				if (key.startsWith('option_') && value !== '') options.push(value);
				else if (key.startsWith('answer_')) {
					if (value) answers.push(index);
					index++;
				}
			});
			dest.options = options;
			dest.answers = answers.map((answer) => [ parseInt(answer) ]);
		} else if (type === 'Snippet') {
			dest.answers = [ [ source.answers ] ];
			if (source.alternate_1) dest.answers[0].push(source.alternate_1);
			if (source.alternate_2) dest.answers[0].push(source.alternate_2);
		} else if (type === 'FC') {
			dest.answers = [ [ source.answers ] ];
			if (source.alternate_1) dest.answers[0].push(source.alternate_1);
			if (source.alternate_2) dest.answers[0].push(source.alternate_2);
		} else if (type === 'TF') dest.answers = [ [ source.answers === 'answer_1' ? 1 : 0 ] ];
		else if (type === 'FIB') {
			const answers = [];
			let current_answers = 0;
			Object.entries(source).forEach(([ key, value ]) => {
				if (key.startsWith('answers')) {
					if (!answers[current_answers]) answers[current_answers++] = [ value ];
					else answers[current_answers++][0] = value;
				} else if (key.startsWith('alternate') && value !== '') {
					const index = key.split('_')[1];
					if (!answers[index - 1]) answers[index - 1] = [ null ];
					answers[index - 1].push(value);
				}
			});
			dest.answers = answers;
		}
		return dest;
	};

	typeChangeHandler = (e) => {
		this.setState({
			type: e.target.value
		});
	};

	resetOptionInput = (values, setValues) => {
		const { type } = this.state;
		const temp = {};
		Object.keys(values).forEach((key) => (temp[key] = ''));
		if (type === 'MCQ') setValues({ ...temp, answers: 'answer_1' });
		else if (type === 'MS') setValues({ ...temp, answer_1: true });
		else if (type === 'FC') setValues({ ...temp });
		else if (type === 'FIB') {
			setValues({ ...temp });
			this.setState({
				FIB_data: Array(5).fill(0).map((_) => ({ answers: '', alternate1: '', alternate2: '' }))
			});
		} else if (type === 'TF') setValues({ ...temp, answers: 'answer_1' });
		else if (type === 'Snippet') setValues({ ...temp });
	};

	FIBHandler = (values, setValues, e) => {
		if (this.state.type === 'FIB') {
			const [ type, index, num ] = e.target.name.split('_');
			const { FIB_data } = this.state;
			FIB_data[index - 1][`${type}${num ? num : ''}`] = e.target.value;
			console.log(`${type}${num ? num : index}`);
			this.setState({
				FIB_data
			});
		}
	};

	render() {
		const { typeChangeHandler, decideValidation, decideInputs, transformValues, resetOptionInput, FIBHandler } = this;
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
				validateOnChange={true}
				customHandler={FIBHandler}
			>
				{({ values, errors, isValid, inputs, setValues }) => {
					return this.props.children({
						form: <OptionFormContainer className="answers_form">{inputs}</OptionFormContainer>,
						type: this.state.type,
						formData: {
							values,
							errors,
							isValid,
							transformValues,
							resetOptionInput: resetOptionInput.bind(null, values, setValues)
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
