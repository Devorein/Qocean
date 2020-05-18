import React, { Component } from 'react';
import InputForm from '../../components/Form/InputForm';
import MultiHeader from '../../components/MultiHeader/MultiHeader';
import * as Yup from 'yup';
import axios from 'axios';
import pluralize from 'pluralize';
import { AppContext } from '../../index';

class Create extends Component {
	state = {
		type: '',
		data: null
	};

	submitForm = (changeResponse, values, { setSubmitting }) => {
		const type = this.state.type.toLowerCase();
		axios
			.post(
				`http://localhost:5001/api/v1/${pluralize(type)}`,
				{
					...values
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				}
			)
			.then(() => {
				setSubmitting(false);
				changeResponse(`Successfully created ${type}`, 'success');
			})
			.catch((err) => {
				setSubmitting(false);
				changeResponse(err.response.data.error, 'error');
			});
	};

	decideForm = (type) => {
		if (type === 'Quiz') {
			axios
				.get('http://localhost:5001/api/v1/folders/me', {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				})
				.then(({ data: { data } }) => {
					if (!this.state.data) {
						this.setState({
							data: data.map((item) => {
								return { text: item.name, value: item._id };
							})
						});
					}
				});
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
			return {
				validationSchema,
				inputs: [
					{ name: 'name', label: `${type} name` },
					{ name: 'subject', label: `${type} subject` },
					{ name: 'source', label: `${type} source` },
					{ name: 'image', label: `${type} image` },
					{ name: 'favourite', label: 'Favourite', type: 'checkbox' },
					{ name: 'public', label: 'Public', type: 'checkbox', value: true },
					{
						name: 'folder',
						label: 'Folder',
						type: 'select',
						selectItems: this.state.data ? this.state.data : []
					}
				]
			};
		} else if (type === 'Question') {
			axios
				.get('http://localhost:5001/api/v1/quizzes/me', {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				})
				.then(({ data: { data } }) => {
					if (!this.state.data) {
						this.setState({
							data: data.map((item) => {
								return { text: item.name, value: item._id };
							})
						});
					}
				});
			const validationSchema = Yup.object({
				question: Yup.string('Enter the question').required('Question is required'),
				favourite: Yup.bool().default(false),
				public: Yup.bool().default(true),
				add_to_score: Yup.bool().default(true),
				quiz: Yup.string('Enter the quiz').required('Quiz is required'),
				type: Yup.string('Enter the type').required('Question type is required'),
				difficulty: Yup.string('Enter the difficulty')
					.oneOf([ 'Beginner', 'Intermediate', 'Advanced' ], 'Should be one of the required value')
					.default('Beginner')
			});
			return {
				validationSchema,
				inputs: [
					{ name: 'name', label: `${type} name` },
					{ name: 'favourite', label: 'Favourite', type: 'checkbox' },
					{ name: 'public', label: 'Public', type: 'checkbox', value: true },
					{ name: 'add_to_score', label: 'Add to Score', type: 'checkbox', value: true },
					{
						name: 'quiz',
						label: 'Quiz',
						type: 'select',
						selectItems: this.state.data ? this.state.data : []
					},
					{
						name: 'type',
						label: 'Type',
						type: 'select',
						selectItems: [
							{ text: 'Fill In the Blanks', value: 'FIB' },
							{ text: 'Multiple Choice', value: 'MCQ' },
							{ text: 'Multiple Select', value: 'MS' },
							{ text: 'Snippet', value: 'Snippet' },
							{ text: 'Flashcard', value: 'FC' },
							{ text: 'True/False', value: 'TF' }
						]
					},
					{
						name: 'difficulty',
						label: 'Difficulty',
						type: 'select',
						selectItems: [
							{ text: 'Beginner', value: 'Beginner' },
							{ text: 'Intermediate', value: 'Intermediate' },
							{ text: 'Advanced', value: 'Advanced' }
						]
					}
				]
			};
		} else if (type === 'Folder') {
			const validationSchema = Yup.object({
				name: Yup.string('Enter folder name').required('Folder name is required'),
				icon: Yup.string('Enter folder icon'),
				favourite: Yup.bool().default(false),
				public: Yup.bool().default(true)
			});
			return {
				validationSchema,
				inputs: [
					{ name: 'name', label: `${type} name` },
					{ name: 'icon', label: `${type} icon` },
					{ name: 'favourite', label: 'Favourite', type: 'checkbox' },
					{ name: 'public', label: 'Public', type: 'checkbox', value: true }
				]
			};
		} else if (type === 'Environment') {
			const validationSchema = Yup.object({
				name: Yup.string(`Enter ${type.toLowerCase()} name`).required(`${type} name is required`),
				icon: Yup.string(`Enter ${type.toLowerCase()} icon`),
				animation: Yup.bool().default(true),
				sound: Yup.bool().default(true),
				favourite: Yup.bool().default(false),
				public: Yup.bool().default(true)
			});
			return {
				validationSchema,
				inputs: [
					{ name: 'name' },
					{ name: 'icon' },
					{ name: 'animation', label: 'Favourite', type: 'checkbox', value: true },
					{ name: 'sound', label: 'Favourite', type: 'checkbox', value: true },
					{ name: 'favourite', label: 'Favourite', type: 'checkbox' },
					{ name: 'public', label: 'Public', type: 'checkbox', value: true }
				]
			};
		}
	};

	changeForm = (type) => {
		this.setState({
			type
		});
	};

	render() {
		const { type } = this.state;
		const headers = [ 'Quiz', 'Question', 'Folder', 'Environment' ];
		return (
			<AppContext.Consumer>
				{({ changeResponse }) => {
					return (
						<div className="Create page">
							<MultiHeader headers={headers} type={type} onHeaderClick={this.changeForm} page="explore" />
							{type ? (
								<InputForm
									{...this.decideForm(type)}
									responseMsg={this.state.responseMsg}
									onSubmit={this.submitForm.bind(null, changeResponse)}
								/>
							) : null}
						</div>
					);
				}}
			</AppContext.Consumer>
		);
	}
}

export default Create;
