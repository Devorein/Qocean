import React, { Component } from 'react';
import CreateQuiz from './CreateQuiz';
import CreateQuestion from './CreateQuestion';
import CreateFolder from './CreateFolder';
import CreateEnvironment from './CreateEnvironment';
import axios from 'axios';
import pluralize from 'pluralize';
import { AppContext } from '../../index';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import SettingsIcon from '@material-ui/icons/Settings';
import HorizontalSplitIcon from '@material-ui/icons/HorizontalSplit';
import './Create.scss';
class Create extends Component {
	submitForm = ([ changeResponse, transformation ], values, { setSubmitting, resetForm }) => {
		const type = this.props.match.params.type.toLowerCase();
		if (transformation) values = transformation(values);
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
				setSubmitting(true);
				setTimeout(() => {
					setSubmitting(false);
				}, 2500);
				changeResponse(`Successfully created ${type}`, 'success');
			})
			.catch((err) => {
				setSubmitting(true);
				setTimeout(() => {
					setSubmitting(false);
				}, 2500);
				changeResponse(err.response.data.error, 'error');
			});
	};

	changeForm = (history, type) => {
		history.push(`/create/${type}`);
	};

	decideForm = (type, changeResponse) => {
		type = type.toLowerCase();
		const props = {
			user: this.props.user,
			onSubmit: this.submitForm,
			changeResponse
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
			<AppContext.Consumer>
				{({ changeResponse }) => {
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
							{this.decideForm(type, changeResponse)}
						</div>
					);
				}}
			</AppContext.Consumer>
		);
	}
}

export default Create;
