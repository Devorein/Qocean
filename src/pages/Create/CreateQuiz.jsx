import React, { Component } from 'react';
import * as Yup from 'yup';
import InputForm from '../../components/Form/InputForm';

const validationSchema = Yup.object({
	name: Yup.string('Enter quiz name')
		.min(3, 'Name can not be less than 3 characters')
		.max(50, 'Name can not be more than 50 characters')
		.required('Quiz name is required'),
	subject: Yup.string('Enter quiz subject').required('Please provide a subject'),
	source: Yup.string('Enter quiz source'),
	image: Yup.string('Enter quiz image'),
	favourite: Yup.bool().default(false),
	public: Yup.bool().default(true),
	folder: Yup.string('Enter folder')
});

class CreateQuiz extends Component {
	render() {
		const { user, onSubmit } = this.props;
		const inputs = [
			{ name: 'name' },
			{ name: 'subject' },
			{ name: 'source' },
			{ name: 'image' },
			{ name: 'favourite', type: 'checkbox', defaultValue: false },
			{ name: 'public', type: 'checkbox', defaultValue: true },
			{
				name: 'folder',
				type: 'select',
				selectItems: user.folders.map(({ _id, name }) => {
					return {
						value: _id,
						text: name
					};
				}),
				disabled: user.folders.length < 1,
				helperText: user.folders.length < 1 ? 'You have not created any folders yet' : null
			}
		];

		return (
			<div>
				<InputForm inputs={inputs} validationSchema={validationSchema} onSubmit={onSubmit} />
			</div>
		);
	}
}

export default CreateQuiz;
