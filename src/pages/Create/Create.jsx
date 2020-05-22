import React, { Component } from 'react';
import CreateQuiz from './CreateQuiz';
import CreateQuestion from './CreateQuestion';
import CreateFolder from './CreateFolder';
import CreateEnvironment from './CreateEnvironment';
import axios from 'axios';
import pluralize from 'pluralize';
import { AppContext } from '../../context/AppContext';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import SettingsIcon from '@material-ui/icons/Settings';
import HorizontalSplitIcon from '@material-ui/icons/HorizontalSplit';
import './Create.scss';

class Create extends Component {
	static contextType = AppContext;

	submitForm = ([ preSubmit, postSubmit ], values, { setSubmitting, resetForm }) => {
		const type = this.props.match.params.type.toLowerCase();
		const { reset_on_success, reset_on_error } = this.props.user.current_environment;
		if (preSubmit) values = preSubmit(values);
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
	};

	changeForm = (history, type) => {
		history.push(`/create/${type}`);
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
		const { match: { params: { type } }, history } = this.props;
		const headers = [
			{ name: 'Quiz', icon: <HorizontalSplitIcon /> },
			{ name: 'Question', icon: <QuestionAnswerIcon /> },
			{ name: 'Folder', icon: <FolderOpenIcon /> },
			{ name: 'Environment', icon: <SettingsIcon /> }
		];
		return (
			<div className="Create page">
				<Tabs
					value={headers.findIndex(({ name }) => name === type)}
					onChange={(e, value) => {
						this.changeForm(history, headers[value].name);
					}}
					indicatorColor="primary"
					textColor="primary"
					centered
				>
					{headers.map(({ name, icon }) => <Tab key={name} label={name} icon={icon} />)}
				</Tabs>
				{this.decideForm(type)}
			</div>
		);
	}
}

export default Create;
