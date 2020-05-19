import React, { Component } from 'react';
import CreateQuiz from './CreateQuiz';
import CreateQuestion from './CreateQuestion';
import CreateFolder from './CreateFolder';
import CreateEnvironment from './CreateEnvironment';
import MultiHeader from '../../components/MultiHeader/MultiHeader';
import axios from 'axios';
import pluralize from 'pluralize';
import { AppContext } from '../../index';

class Create extends Component {
	submitForm = (changeResponse, values, { setSubmitting }) => {
		const type = this.props.match.params.type.toLowerCase();
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

	changeForm = (history, type) => {
		history.push(`/create/${type.toLowerCase()}`);
	};

	decideForm = (type, changeResponse) => {
		type = type.toLowerCase();
		const props = {
			user: this.props.user,
			onSubmit: this.submitForm.bind(null, changeResponse)
		};
		if (type === 'quiz') return <CreateQuiz {...props} />;
		else if (type === 'question') return <CreateQuestion {...props} />;
		else if (type === 'folder') return <CreateFolder {...props} />;
		else if (type === 'environment') return <CreateEnvironment {...props} />;
	};
	render() {
		const { match: { params: { type } }, history } = this.props;
		const headers = [ 'Quiz', 'Question', 'Folder', 'Environment' ];
		return (
			<AppContext.Consumer>
				{({ changeResponse }) => {
					return (
						<div className="Create page">
							<MultiHeader
								headers={headers}
								type={type}
								onHeaderClick={this.changeForm.bind(null, history)}
								page="explore"
							/>
							{this.decideForm(type, changeResponse)}
						</div>
					);
				}}
			</AppContext.Consumer>
		);
	}
}

export default Create;
