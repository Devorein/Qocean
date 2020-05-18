import React, { Component } from 'react';
import InputForm from '../../components/Form/InputForm';
import MultiHeader from '../../components/MultiHeader/MultiHeader';
import * as Yup from 'yup';
import axios from 'axios';
import pluralize from 'pluralize';

class Create extends Component {
	state = {
		type: '',
		responseMsg: {}
	};

	submitForm = (values, { setSubmitting }) => {
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
				this.setState({
					responseMsg: {
						state: 'success',
						msg: `Successfully created ${type}`
					}
				});
			})
			.catch((err) => {
				setSubmitting(false);
				this.setState({
					responseMsg: {
						state: 'error',
						msg: err.response.data.error
					}
				});
			});
	};

	decideForm = (type) => {
		if (type === 'Folder') {
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
			<div className="Create page">
				<MultiHeader headers={headers} type={type} onHeaderClick={this.changeForm} page="explore" />
				{type ? (
					<InputForm {...this.decideForm(type)} responseMsg={this.state.responseMsg} onSubmit={this.submitForm} />
				) : null}
			</div>
		);
	}
}

export default Create;
