import React, { Component } from 'react';
import InputForm from '../../components/Form/InputForm';
import * as Yup from 'yup';
import styled from 'styled-components';
import InputSelect from '../../components/Input/InputSelect';
import TextField from '@material-ui/core/TextField';

const Arraydiff = (target, a) => target.filter((i) => a.indexOf(i) < 0);

const OptionFormContainer = styled.div`
	& .form {
		height: 100%;
		& .form-content {
			max-height: 100%;
			grid-area: 1/1/3/2;
		}
	}
`;

class OptionForm extends Component {
	state = {
		type: this.props.defaultType || 'MCQ',
		blank_count: this.props.blank_count ? this.props.blank_count : 1,
		FIB_data: (() => {
			if (this.props.defaultType !== 'FIB')
				return Array(5).fill(0).map((_) => ({ answers: '', alternate1: '', alternate2: '' }));
			else {
				const { defaultAnswers } = this.props;
				return defaultAnswers.map((defaultAnswer) => ({
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
		const options = [ 'option', 'additional_option' ].map((opt_type, index) => {
			const opt_obj = {
				type: 'group',
				name: 'options',
				key: opt_type,
				children: Array(3).fill(0).map((_, i) => ({ name: i + 1 + 3 * index, label: `${opt_type}_${i + 1}` })),
				extra: {
					treeView: true,
					append: true,
					groupType: 'text',
					helperText: `Provide ${opt_type.split('_').join(' ')}`,
					className: `OptionForm_MS_${opt_type}s`
				}
			};
			if (index === 1) opt_obj.extra.collapsed = true;
			return opt_obj;
		});

		const { type } = this.state;
		const { defaultAnswers, defaultOptions } = this.props;
		if (type === 'MS' || type === 'MCQ') {
			let ref = null;
			if (type === 'MCQ') {
				ref = {
					options: [ ...options ],
					answers: [
						{
							name: 'answers',
							type: 'radio',
							extra: {
								className: 'OptionForm_MS_answers',
								radioItems: Array(6).fill(0).map((_, i) => ({ value: `answer_${i + 1}`, label: `Answer ${i + 1}` }))
							},
							defaultValue: 'answer_1'
						}
					]
				};
				ref.answers[0].defaultValue = `answer_${defaultAnswers[0] ? parseInt(defaultAnswers[0]) + 1 : '1'}`;
			} else if (type === 'MS') {
				ref = {
					options: [ ...options ],
					answers: [
						{
							type: 'group',
							name: 'answers',
							extra: {
								groupType: 'checkbox',
								treeView: true,
								coalesce: true,
								useIndex: true,
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
					{
						name: 'answers',
						type: 'textarea',
						extra: { row: 4 },
						defaultValue: defaultAnswers[0] ? defaultAnswers[0][0] : ''
					},
					{
						name: 'alternate_1',
						type: 'textarea',
						extra: { row: 2 },
						defaultValue: defaultAnswers[0] ? defaultAnswers[0][1] : ''
					},
					{
						name: 'alternate_2',
						type: 'textarea',
						extra: { row: 2 },
						defaultValue: defaultAnswers[0] ? defaultAnswers[0][2] : ''
					}
				],
				options: []
			};
		else if (type === 'Snippet')
			return {
				answers: [
					{
						name: 'answers',
						type: 'textarea',
						extra: { row: 2 },
						defaultValue: defaultAnswers[0] ? defaultAnswers[0][0] : ''
					},
					{
						name: 'alternate_1',
						type: 'textarea',
						extra: { row: 1 },
						defaultValue: defaultAnswers[0] ? defaultAnswers[0][1] : ''
					},
					{
						name: 'alternate_2',
						type: 'textarea',
						extra: { row: 1 },
						defaultValue: defaultAnswers[0] ? defaultAnswers[0][2] : ''
					}
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
			const optionsObj = {};
			[ 'option', 'additional_option' ].forEach((opt_type, i) => {
				[ 1, 2, 3 ].forEach((opt_num) => {
					const excluded = Arraydiff([ 1, 2, 3 ], [ opt_num ]).map((num) => Yup.ref(`${opt_type}_${num}`));
					[ 1, 2, 3 ].forEach((num) => {
						excluded.push(Yup.ref(`${i === 0 ? 'additional_option' : 'option'}_${num}`));
					});
					optionsObj[`${opt_type}_${opt_num}`] = Yup.string(`Enter ${opt_type.split('_').join(' ')} ${opt_num}`)
						.notOneOf(excluded, 'Duplicate Option found')
						.required(`${opt_type.split('_').join(' ')} ${opt_num} is required`);
				});
			});

			if (type === 'MCQ')
				return Yup.object({
					// options: optionsObj,
					answers: Yup.string('Enter answer')
						.oneOf(Array(6).fill(0).map((_, i) => `answer_${i + 1}`))
						.required('An answer must be choosen')
				});
			else if (type === 'MS')
				return Yup.object({
					// options: optionsObj,
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
			if (type === 'MCQ') dest.answers = [ (parseInt(source.answers.split('_')[1]) - 1).toString() ];
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

	render () {
		const { typeChangeHandler, decideValidation, decideInputs, transformValues, FIBHandler } = this;
		const { options, answers } = decideInputs();
		return (
			<InputForm
				passFormAsProp={true}
				validationSchema={decideValidation()}
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
