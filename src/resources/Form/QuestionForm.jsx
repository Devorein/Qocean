import React, { Component, Fragment } from 'react';
import { withTheme } from '@material-ui/core';
import * as Yup from 'yup';
import InputForm from '../../components/Form/InputForm';
import axios from 'axios';
import OptionForm from './OptionForm';
import FileInputRP from '../../RP/FileInputRP';

let defaultInputs = [
	{ name: 'name' },
	null,
	null,
	{
		name: 'format',
		type: 'select',
		extra: {
			selectItems: [ { text: 'Markdown', value: 'md' }, { text: 'Regular', value: 'regular' } ]
		},
		defaultValue: 'regular'
	},
	{
		name: 'difficulty',
		type: 'radio',
		extra: {
			radioItems: [
				{ label: 'Beginner', value: 'Beginner' },
				{ label: 'Intermediate', value: 'Intermediate' },
				{ label: 'Advanced', value: 'Advanced' }
			]
		},
		defaultValue: 'Advanced'
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

class QuestionForm extends Component {
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

	preSubmit = (getFileData, formData, values) => {
		let { values: formValues, transformValues, isValid } = formData;
		if (isValid) {
			values = transformValues(formValues, values);
			if (values) {
				const { image, src } = getFileData();
				if (image === 'link') values.image = src;
				return [ values, true ];
			} else return [ values, false ];
		} else return [ values, false ];
	};

	postSubmit = ({ getFileData, resetFileInput }, formData, response) => {
		const env = this.props.user.current_environment;
		const { resetOptionInput } = formData;
		if (!response instanceof Error) {
			const { data: { data: { _id } } } = response;
			const fd = new FormData();
			const { file, image } = getFileData();
			if (file && image === 'upload') {
				fd.append('file', file, file.name);
				axios
					.put(`http://localhost:5001/api/v1/questions/${_id}/photo`, fd, {
						headers: {
							'Content-Type': 'multipart/form-data',
							Authorization: `Bearer ${localStorage.getItem('token')}`
						}
					})
					.then((data) => {
						if (env.reset_on_success) resetOptionInput();
						setTimeout(() => {
							this.props.changeResponse(`Uploaded`, `Successsfully uploaded image for the question`, 'success');
						}, env.notification_timing + 500);
					})
					.catch((err) => {
						if (env.reset_on_error) resetOptionInput();
						setTimeout(() => {
							this.props.changeResponse(`An error occurred`, err.response.data.error, 'error');
						}, env.notification_timing + 500);
					});
			} else if (env.reset_on_success || env.reset_on_error) resetOptionInput();
		} else if (env.reset_on_success || env.reset_on_error) resetOptionInput();
	};

	render() {
		const { preSubmit, postSubmit } = this;
		const { onSubmit, sumbitMsg, customInputs, src = '' } = this.props;
		const { quizzes, loading } = this.state;
		const validationSchema = Yup.object({
			name: Yup.string('Enter the question').required('Question is required'),
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

		defaultInputs[1] = {
			name: 'quiz',
			type: 'select',
			extra: {
				selectItems: quizzes.map(({ _id, name }) => {
					return {
						value: _id,
						text: name
					};
				})
			},
			disabled: quizzes.length < 1,
			helperText: loading ? (
				'Loading your quizzes'
			) : quizzes.length < 1 ? (
				<b style={{ color: this.props.theme.palette.error.main }}>You have not created any quizzes yet</b>
			) : null
		};
		if (customInputs) defaultInputs = customInputs(defaultInputs);

		return (
			<FileInputRP src={src}>
				{({ FileInput, resetFileInput, getFileData }) => {
					return (
						<div className="create_question create_form">
							<OptionForm>
								{({ form, formData, select, type }) => {
									if (type === 'FIB') defaultInputs[0] = { name: 'name', type: 'textarea', extra: { row: 4 } };
									else defaultInputs[0] = { name: 'name' };
									defaultInputs[2] = select;
									return (
										<Fragment>
											<InputForm
												sumbitMsg={sumbitMsg}
												inputs={defaultInputs}
												validationSchema={validationSchema}
												onSubmit={onSubmit.bind(null, [
													'question',
													preSubmit.bind(null, getFileData, formData),
													postSubmit.bind(null, { getFileData, resetFileInput }, formData)
												])}
												classNames={'question_form'}
												disabled={this.state.quizzes.length === 0}
											/>
											{form}
											{FileInput}
										</Fragment>
									);
								}}
							</OptionForm>
						</div>
					);
				}}
			</FileInputRP>
		);
	}
}

export default withTheme(QuestionForm);
