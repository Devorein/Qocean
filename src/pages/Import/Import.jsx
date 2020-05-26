import React, { Component, Fragment } from 'react';
import CustomTabs from '../../components/Tab/Tabs';
import { withRouter } from 'react-router-dom';
import UploadButton from '../../components/Buttons/UploadButton';
import { AppContext } from '../../context/AppContext';
import CustomList from '../../components/List/List';
import DeleteIcon from '@material-ui/icons/Delete';
import PublishIcon from '@material-ui/icons/Publish';
import CreateFolder from '../Create/CreateFolder';
import CreateQuestion from '../Create/CreateQuestion';
import CreateQuiz from '../Create/CreateQuiz';
import CreateEnvironment from '../Create/CreateEnvironment';
import TagCreator from '../../components/Chip/TagCreator';
import './Import.scss';

class Import extends Component {
	static contextType = AppContext;

	state = {
		data: [],
		inputs: [],
		currentType: '',
		selectedIndex: null
	};

	switchPage = (page) => {
		this.props.history.push(`/${page.link}`);
		this.setState({
			inputs: [],
			data: [],
			selectedIndex: null
		});
	};

	setFile = (type, e) => {
		e.persist();
		const reader = new FileReader();
		const { files: [ file ] } = e.target;
		delete this.UploadButton.files[0];
		this.UploadButton.value = '';
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

	transformList = (data) => {
		const { match: { params: { type } } } = this.props;
		return data.map((data) => {
			return {
				primary: data.name || data.question,
				primaryIcon: type
			};
		});
	};

	renderList = () => {
		const { match: { params: { type } } } = this.props;
		const { data } = this.state;
		return data.length !== 0 ? (
			<div className={`${type}-import-section-list import-section-list`}>
				<CustomList
					containsCheckbox={true}
					title={`Imported ${data.length} ${type.toLowerCase()}`}
					listItems={this.transformList(data)}
					onClick={(selectedIndex, e) => {
						this.setState({
							selectedIndex
						});
					}}
					ref={(r) => (this.CustomList = r)}
					selectedIcons={[
						<DeleteIcon
							key={'delete'}
							onClick={(e) => {
								this.deleteItems(this.CustomList.state.checked);
								this.CustomList.state.checked = [];
							}}
						/>,
						<PublishIcon key={'publish'} onClick={(e) => {}} />
					]}
				/>
			</div>
		) : (
			<div>Nothing imported</div>
		);
	};

	deleteItems = (indexes) => {
		const filtered = this.state.data.filter((data, index) => !indexes.includes(index));
		this.setState({
			data: filtered
		});
	};

	renderForm = () => {
		let { match: { params: { type } } } = this.props;
		let { currentType, selectedIndex, data } = this.state;

		currentType = currentType.toLowerCase();
		type = type.toLowerCase();

		const props = {
			user: this.props.user,
			submitMsg: 'Import',
			onSubmit: this.context.submitForm
		};
		const cond = currentType === type && data.length > 0 && typeof selectedIndex === 'number';

		if (cond && type === 'quiz')
			return (
				<CreateQuiz
					ref={(r) => {
						this.CreateQuiz = r;
						if (this.CreateQuiz)
							this.CreateQuiz.setState({
								tags: data[selectedIndex].tags
							});
					}}
					{...props}
					customInputs={(defaultInputs) => {
						const props = [ 'name', 'subject', 'source', 'favourite', 'public' ];
						const target = data[selectedIndex];
						props.forEach(
							(prop, index) =>
								(defaultInputs[index].defaultValue = target[prop] ? target[prop] : defaultInputs[index].defaultValue)
						);
						return defaultInputs;
					}}
				/>
			);
		else if (cond && type === 'question') return <CreateQuestion {...props} />;
		else if (cond && type === 'folder')
			return (
				<CreateFolder
					{...props}
					customInputs={(defaultInputs) => {
						const props = [ 'name', 'icon', 'favourite', 'public' ];
						const target = data[selectedIndex];
						props.forEach(
							(prop, index) =>
								(defaultInputs[index].defaultValue = target[prop] ? target[prop] : defaultInputs[index].defaultValue)
						);
						return defaultInputs;
					}}
				/>
			);
		else if (cond && type === 'environment') return <CreateEnvironment {...props} />;
	};

	render() {
		const { setFile, renderList, renderForm } = this;
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
				<UploadButton
					setFile={setFile.bind(null, type)}
					msg={`Import ${type}`}
					accept={'application/json'}
					inputRef={(i) => (this.UploadButton = i)}
				/>
				<div className={`import-section ${type}-import-section`}>
					{renderList()}
					{renderForm()}
				</div>
			</div>
		);
	}
}

export default withRouter(Import);
