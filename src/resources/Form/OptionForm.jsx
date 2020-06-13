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

const options = [
	{
		type: 'group',
		name: 'options',
		children: Array(3).fill(0).map((_, index) => ({ name: `option_${index + 1}` })),
		extra: {
			treeView: true,
			coalesce: true,
			groupType: 'text',
			helperText: 'Provide options',
			className: 'OptionForm_MS_options'
		}
	},
	{
		type: 'group',
		name: 'additional_options',
		children: Array(3).fill(0).map((_, index) => ({ name: `additional_option_${index + 1}` })),
		extra: {
			treeView: true,
			collapsed: true,
			coalesce: true,
			groupType: 'text',
			helperText: 'Provide additional options(optional)',
			className: 'OptionForm_MS_addoptions'
		}
	}
];

const INIT_MCQ_STATE = {
	options: [ ...options ],
	answers: [
		{
			name: 'answers',
			type: 'radio',
			extra: {
				className: 'OptionForm_MS_answers',
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
	options: [ ...options ],
	answers: [
		{
			type: 'group',
			name: 'answers',
			extra: {
				groupType: 'checkbox',
				treeView: true,
				coalesce: true,
				useArray: true,
				row: true,
				helperText: 'Choose answers',
				className: 'OptionForm_MS_answers'
			},
			children: Array(6).fill(0).map((_, index) => ({
				name: `answer_${index + 1}`,
				type: 'checkbox',
				defaultValue: false
			}))
		}
	]
};

class OptionForm extends Component {
	state = {
		type: this.props.defaultType || 'MCQ',
		blank_count: this.props.blank_count ? this.props.blank_count : 1,
		FIB_data: (() => {
			if (this.props.defaultType !== 'FIB')
				return Array(5).fill(0).map((_) => ({ answers: '', alternate1: '', alternate2: '' }));
			else {
				const { defaultAnswers } = this.props;
				return defaultAnswers.map((defaultAnswer, index) => ({
					answers: defaultAnswer[0],
					alternate1: defaultAnswer[1],
					alternate2: defaultAnswer[2]
				}));
			}
		})()
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
		const { defaultAnswers, defaultOptions } = this.props;
		if (type === 'MS' || type === 'MCQ') {
			let ref = null;
			if (type === 'MCQ') {
				ref = INIT_MCQ_STATE;
				ref.answers[0].defaultValue = `answer_${parseInt(defaultAnswers[0]) + 1}`;
			} else if (type === 'MS') {
				ref = INIT_MS_STATE;
				const answers = defaultAnswers.flat().map((answer) => parseInt(answer));
				ref.answers[0].children = ref.answers[0].children.map((child, index) => {
					return {
						...child,
						defaultValue: answers.includes(index)
					};
				});
			}
			ref.options[0].children = options[0].children.map((child, index) => ({
				...child,
				defaultValue: defaultOptions[index]
			}));
			ref.options[1].children = options[1].children.map((child, index) => ({
				...child,
				defaultValue: defaultOptions[index + 3]
			}));
			return ref;
		} else if (type === 'FC')
			return {
				answers: [
					{ name: 'answers', type: 'textarea', extra: { row: 4 }, defaultValue: defaultAnswers[0][0] },
					{ name: 'alternate_1', type: 'textarea', extra: { row: 2 }, defaultValue: defaultAnswers[0][1] },
					{ name: 'alternate_2', type: 'textarea', extra: { row: 2 }, defaultValue: defaultAnswers[0][2] }
				],
				options: []
			};
		else if (type === 'Snippet')
			return {
				answers: [
					{ name: 'answers', type: 'textarea', extra: { row: 2 }, defaultValue: defaultAnswers[0][0] },
					{ name: 'alternate_1', type: 'textarea', extra: { row: 1 }, defaultValue: defaultAnswers[0][1] },
					{ name: 'alternate_2', type: 'textarea', extra: { row: 1 }, defaultValue: defaultAnswers[0][2] }
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
						defaultValue: defaultAnswers[0] ? `answer_${defaultAnswers[0][0]}` : 'answer_1'
					}
				]
			};
	};

	decideValidation = () => {
		const { type } = this.state;
		if (type === 'MCQ' || type === 'MS') {
			const optionObj = {
				options: Yup.object({
					option_1: Yup.string('Enter option 1')
						.notOneOf(
							[
								Yup.ref('option_2'),
								Yup.ref('option_3'),
								Yup.ref('additional_options.additional_option_1'),
								Yup.ref('additional_option_2'),
								Yup.ref('additional_option_3')
							],
							'Duplicate Option found'
						)
						.required('Option 1 is required'),
					option_2: Yup.string('Enter option 2')
						.required('Option 2 is required')
						.notOneOf(
							[
								Yup.ref('option_1'),
								Yup.ref('option_3'),
								Yup.ref('additional_option_1'),
								Yup.ref('additional_option_2'),
								Yup.ref('additional_option_3')
							],
							'Duplicate Option found'
						),
					option_3: Yup.string('Enter option 3')
						.required('Option 3 is required')
						.notOneOf(
							[
								Yup.ref('option_1'),
								Yup.ref('option_2'),
								Yup.ref('additional_option_1'),
								Yup.ref('additional_option_2'),
								Yup.ref('additional_option_3')
							],
							'Duplicate Option found'
						)
				}),
				additional_options: Yup.object({
					additional_option_1: Yup.string('Enter additional option 1')
						.notOneOf(
							[
								Yup.ref('options.option_1'),
								Yup.ref('options.option_2'),
								Yup.ref('options.option_3'),
								Yup.ref('additional_option_2'),
								Yup.ref('additional_option_3')
							],
							'Duplicate Option found'
						)
						.default('additional_option_1'),
					additional_option_2: Yup.string('Enter additional option 2')
						.notOneOf(
							[
								Yup.ref('options.option_1'),
								Yup.ref('options.option_2'),
								Yup.ref('options.option_3'),
								Yup.ref('additional_option_1'),
								Yup.ref('additional_option_3')
							],
							'Duplicate Option found'
						)
						.default('additional_option_2'),
					additional_option_3: Yup.string('Enter additional option 3')
						.notOneOf(
							[
								Yup.ref('options.option_1'),
								Yup.ref('options.option_2'),
								Yup.ref('options.option_3'),
								Yup.ref('additional_option_1'),
								Yup.ref('additional_option_2')
							],
							'Duplicate Option found'
						)
						.default('additional_option_3')
				})
			};
			if (type === 'MCQ')
				return Yup.object({
					...optionObj,
					answers: Yup.string('Enter answer')
						.oneOf([ 'answer_1', 'answer_2', 'answer_3', 'answer_4', 'answer_5', 'answer_6' ])
						.required('An answer must be choosen')
				});
			else if (type === 'MS')
				return Yup.object({
					...optionObj,
					answers: Yup.array()
						.of(Yup.boolean())
						.test(
							'Test answers length',
							'Must choose atleast two answers',
							(vals = []) => vals.filter((val) => val).length >= 2
						)
				});
		} else if (type === 'Snippet')
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
		if (type === 'MCQ' || type === 'MS') {
			const options = [];
			Object.entries(source.options).forEach(([ key, value ]) => {
				if (value !== '') options.push(value);
			});
			Object.entries(source.additional_options).forEach(([ key, value ]) => {
				if (value !== '') options.push(value);
			});
			if (type === 'MCQ') dest.answers = [ parseInt(source.answers.split('_')[1]) - 1 ];
			else {
				dest.answers = [];
				source.answers.forEach((answer, index) => {
					if (answer) dest.answers.push([ index ]);
				});
			}
			dest.options = options;
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

	FIBHandler = (values, setValues, e) => {
		if (this.state.type === 'FIB') {
			const [ type, index, num ] = e.target.name.split('_');
			const { FIB_data } = this.state;
			FIB_data[index - 1][`${type}${num ? num : ''}`] = e.target.value;
			this.setState({
				FIB_data
			});
		}
	};

	render() {
		const { typeChangeHandler, decideValidation, decideInputs, transformValues, FIBHandler } = this;
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
				{({ values, errors, isValid, inputs, resetForm }) => {
					return this.props.children({
						form: <OptionFormContainer className="answers_form">{inputs}</OptionFormContainer>,
						type: this.state.type,
						formData: {
							values,
							errors,
							isValid,
							transformValues,
							resetOptionInput: resetForm
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
