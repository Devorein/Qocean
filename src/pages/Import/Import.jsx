import React, { Component } from 'react';
import CustomTabs from '../../components/Tab/Tabs';
import { withRouter } from 'react-router-dom';
import UploadButton from '../../components/Buttons/UploadButton';
import ImportQuiz from './ImportQuizzes';
import ImportQuestion from './ImportQuestions';
import ImportFolder from './ImportFolders';
import ImportEnvironment from './ImportEnvironments';
import { AppContext } from '../../context/AppContext';

class Import extends Component {
	static contextType = AppContext;

	switchPage = (page) => {
		this.props.history.push(`/${page.link}`);
	};

	state = {
		data: [],
		inputs: []
	};

	setFile = (e) => {
		e.persist();
		const reader = new FileReader();
		const { files: [ file ] } = e.target;

		reader.onload = (e) => {
			file.text().then((data) => {
				this.setState({
					data: JSON.parse(data)
				});
			});
		};
		reader.readAsDataURL(file);
	};

	submitForm = (e) => {
		console.log(e);
	};

	decideForm = (type) => {
		type = type.toLowerCase();
		const props = {
			user: this.props.user,
			onSubmit: this.submitForm,
			data: this.state.data,
			changeResponse: this.context.changeResponse,
			type
		};
		if (type === 'quiz') return <ImportQuiz {...props} />;
		else if (type === 'question') return <ImportQuestion {...props} />;
		else if (type === 'folder') return <ImportFolder {...props} />;
		else if (type === 'environment') return <ImportEnvironment {...props} />;
	};

	render() {
		const { setFile, decideForm } = this;
		const { match: { params: { type } } } = this.props;

		const headers = [ 'Quiz', 'Question', 'Folder', 'Environment' ].map((header) => {
			return {
				name: header,
				link: `import/${header}`
			};
		});

		return (
			<div className="Import page">
				<CustomTabs
					against={type}
					onChange={(e, value) => {
						this.switchPage(headers[value]);
					}}
					height={50}
					headers={headers}
				/>
				<UploadButton setFile={setFile} msg={`Import ${type}`} accept={'application/json'} />
				{decideForm(type)}
			</div>
		);
	}
}

export default withRouter(Import);
