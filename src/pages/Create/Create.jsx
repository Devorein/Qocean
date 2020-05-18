import React, { Component } from 'react';
import InputForm from '../../components/Form/InputForm';
import MultiHeader from '../../components/MultiHeader/MultiHeader';
import * as Yup from 'yup';
import axios from 'axios';
import pluralize from 'pluralize';
import { AppContext } from '../../index';

class Create extends Component {
	state = {
		type: ''
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
			const validationSchema = Yup.object({
				name: Yup.string('Enter quiz name')
					.min(3, 'Name can not be less than 3 characters')
					.max(50, 'Name can not be more than 50 characters')
					.required('Quiz name is required'),
				subject: Yup.string('Enter quiz subject').required('Please provide a subject'),
				source: Yup.string('Enter quiz source'),
				image: Yup.string('Enter quiz image'),
				favourite: Yup.bool().default(false),
				public: Yup.bool().default(true)
			});
			return {
				validationSchema,
				inputs: [
					{ name: 'name', label: `${type} name` },
					{ name: 'subject', label: `${type} subject` },
					{ name: 'source', label: `${type} source` },
					{ name: 'image', label: `${type} image` },
					{ name: 'favourite', label: 'Favourite', type: 'checkbox' },
					{ name: 'public', label: 'Public', type: 'checkbox', value: true }
				]
			};
		} else if (type === 'Folder') {
			const validationSchema = Yup.object({
				name: Yup.string('Enter folder name').required('Folder name is required'),
				icon: Yup.string('Enter folder icon')
			});
			return {
				validationSchema,
				inputs: [ { name: 'name', label: `${type} name` }, { name: 'icon', label: `${type} icon` } ]
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
