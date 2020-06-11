import React, { Component } from 'react';
import FolderForm from '../../resources/Form/FolderForm';
import QuestionForm from '../../resources/Form/QuestionForm';
import QuizForm from '../../resources/Form/QuizForm';
import EnvironmentForm from '../../resources/Form/EnvironmentForm';
import { AppContext } from '../../context/AppContext';
import CustomTabs from '../../components/Tab/Tabs';
import PageSwitcher from '../../components/PageSwitcher/PageSwitcher';
import './Create.scss';

class Create extends Component {
	static contextType = AppContext;

	decideForm = (type) => {
		type = type.toLowerCase();
		const props = {
			user: this.props.user,
			onSubmit: this.context.submitForm,
			changeResponse: this.context.changeResponse
		};
		if (type === 'quiz') return <QuizForm {...props} />;
		else if (type === 'question') return <QuestionForm {...props} />;
		else if (type === 'folder') return <FolderForm {...props} />;
		else if (type === 'environment') return <EnvironmentForm {...props} />;
	};

	render() {
		return (
			<PageSwitcher page="create">
				{({ CustomTabs, type }) => (
					<div className="Create page">
						{CustomTabs}
						{this.decideForm(type)}
					</div>
				)}
			</PageSwitcher>
		);
	}
}

export default Create;
