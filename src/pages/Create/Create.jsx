import React, { Component } from 'react';
import CreateQuiz from './CreateQuiz';
import CreateQuestion from './CreateQuestion';
import CreateFolder from './CreateFolder';
import CreateEnvironment from './CreateEnvironment';
import axios from 'axios';
import pluralize from 'pluralize';
import { AppContext } from '../../context/AppContext';
import CustomTabs from '../../components/Tab/Tabs';
import './Create.scss';

class Create extends Component {
	static contextType = AppContext;

	submitForm = ([ preSubmit, postSubmit ], values, { setSubmitting, resetForm }) => {
		const type = this.props.match.params.type.toLowerCase();
		const { reset_on_success, reset_on_error } = this.props.user.current_environment;
		let canSubmit = true;
		if (preSubmit) {
			let [ transformedValue, shouldSubmit ] = preSubmit(values);
			values = transformedValue;
			canSubmit = shouldSubmit;
		}
		if (canSubmit) {
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
				.then((data) => {
					if (reset_on_success) resetForm();
					setSubmitting(true);
					setTimeout(() => {
						setSubmitting(false);
					}, 2500);
					this.context.changeResponse(
						`Success`,
						`Successsfully created ${type} ${values.name || values.question}`,
						'success'
					);
					if (postSubmit) postSubmit(data);
				})
				.catch((err) => {
					if (reset_on_error) resetForm();
					setSubmitting(true);
					setTimeout(() => {
						setSubmitting(false);
					}, 2500);
					this.context.changeResponse(
						`An error occurred`,
						err.response.data ? err.response.data.error : `Failed to create ${type}`,
						'error'
					);
					if (postSubmit) postSubmit(err);
				});
		} else {
			setSubmitting(true);
			setTimeout(() => {
				setSubmitting(false);
			}, 2500);
		}
	};

	changeForm = (type) => {
		this.props.history.push(`/${type.link}`);
	};

	decideForm = (type) => {
		type = type.toLowerCase();
		const props = {
			user: this.props.user,
			onSubmit: this.submitForm,
			changeResponse: this.context.changeResponse
		};
		if (type === 'quiz') return <CreateQuiz {...props} />;
		else if (type === 'question') return <CreateQuestion {...props} />;
		else if (type === 'folder') return <CreateFolder {...props} />;
		else if (type === 'environment') return <CreateEnvironment {...props} />;
	};

	render() {
		const { match: { params: { type } } } = this.props;

		const headers = [ 'Quiz', 'Question', 'Folder', 'Environment' ].map((header) => {
			return {
				name: header,
				link: `create/${header}`
			};
		});

		return (
			<div className="Create page">
				<CustomTabs
					against={type}
					onChange={(e, value) => {
						this.changeForm(headers[value]);
					}}
					height={50}
					headers={headers}
				/>
				{this.decideForm(type)}
			</div>
		);
	}
}

export default Create;
