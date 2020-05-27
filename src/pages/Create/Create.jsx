import React, { Component } from 'react';
import FolderForm from '../../resources/Form/FolderForm';
import QuestionForm from '../../resources/Form/QuestionForm';
import QuizForm from '../../resources/Form/QuizForm';
import EnvironmentForm from '../../resources/Form/EnvironmentForm';
import { AppContext } from '../../context/AppContext';
import CustomTabs from '../../components/Tab/Tabs';
import './Create.scss';

class Create extends Component {
	static contextType = AppContext;

	changeForm = (type) => {
		this.props.history.push(`/${type.link}`);
	};

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
