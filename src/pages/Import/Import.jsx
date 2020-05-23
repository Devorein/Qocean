import React, { Component } from 'react';
import CustomTabs from '../../components/Tab/Tabs';
import { withRouter } from 'react-router-dom';
import UploadButton from '../../components/Buttons/UploadButton';
import ImportQuiz from './ImportQuizzes';
import ImportQuestion from './ImportQuestions';
import ImportFolder from './ImportFolders';
import ImportEnvironment from './ImportEnvironments';
import { AppContext } from '../../context/AppContext';
import './Import.scss';

class Import extends Component {
	static contextType = AppContext;

	switchPage = (page) => {
		this.props.history.push(`/${page.link}`);
	};

	state = {
		data: [],
		inputs: [],
		currentType: ''
	};

	setFile = (type, e) => {
		e.persist();
		const reader = new FileReader();
		const { files: [ file ] } = e.target;

		reader.onload = (e) => {
			file.text().then((data) => {
				this.setState({
					currentType: type,
					data: JSON.parse(data)
				});
			});
		};
		reader.readAsDataURL(file);
	};

	deleteItems = (indexes) => {
		const filtered = this.state.data.filter((data, index) => !indexes.includes(index));
		this.setState({
			data: filtered
		});
	};

	decideForm = (type) => {
		let { currentType } = this.state;
		currentType = currentType.toLowerCase();
		type = type.toLowerCase();

		const props = {
			user: this.props.user,
			onSubmit: this.context.submitForm,
			data: this.state.data,
			changeResponse: this.context.changeResponse,
			type,
			deleteItems: this.deleteItems
		};
		if (currentType === type && type === 'quiz') return <ImportQuiz {...props} />;
		else if (currentType === type && type === 'question') return <ImportQuestion {...props} />;
		else if (currentType === type && type === 'folder') return <ImportFolder {...props} />;
		else if (currentType === type && type === 'environment') return <ImportEnvironment {...props} />;
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
				<UploadButton setFile={setFile.bind(null, type)} msg={`Import ${type}`} accept={'application/json'} />
				<div className={`import-section ${type}-import-section`}>{decideForm(type)}</div>
			</div>
		);
	}
}

export default withRouter(Import);
