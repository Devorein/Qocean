import React, { Component } from 'react';
import * as Yup from 'yup';
import InputForm from '../../components/Form/InputForm';
import axios from 'axios';

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
	state = {
		folders: []
	};
	componentDidMount() {
		axios
			.get('http://localhost:5001/api/v1/folders/me?select=name', {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			})
			.then(({ data: { data: folders } }) => {
				this.setState({
					folders
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}
	render() {
		const { onSubmit } = this.props;
		const { folders } = this.state;
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
				selectItems: folders.map(({ _id, name }) => {
					return {
						value: _id,
						text: name
					};
				}),
				disabled: folders.length < 1,
				helperText: folders.length < 1 ? 'You have not created any folders yet' : null
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
