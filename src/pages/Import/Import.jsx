import React, { Component, Fragment } from 'react';
import CustomTabs from '../../components/Tab/Tabs';
import { withRouter } from 'react-router-dom';
import UploadButton from '../../components/Buttons/UploadButton';
import { AppContext } from '../../context/AppContext';
import CustomList from '../../components/List/List';
import DeleteIcon from '@material-ui/icons/Delete';
import PublishIcon from '@material-ui/icons/Publish';
import CreateFolder from '../../resources/Folder/CreateFolder';
import CreateQuestion from '../Create/CreateQuestion';
import CreateQuiz from '../Create/CreateQuiz';
import CreateEnvironment from '../Create/CreateEnvironment';
import ChipContainer from '../../components/Chip/ChipContainer';

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
			selectedIndex: 0
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

	initializeData = (data) => {
		const { match: { params: { type } } } = this.props;
		if (type === 'Folder') {
			return {
				name: data.name ? data.name : '',
				favourite: data.favourite ? data.favourite : false,
				public: data.public ? data.public : true,
				icon: data.icon ? data.icon : 'Red_folder.svg'
			};
		}
	};
	renderForm = () => {
		const { data, selectedIndex } = this.state;
		const { match: { params: { type } } } = this.props;
		if (type === 'Folder' && data.length > 0 && typeof selectedIndex === 'number')
			return <CreateFolder initialValues={this.initializeData(data[selectedIndex])} />;
		else return null;
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

	decideForm = () => {
		let { match: { params: { type } } } = this.props;
		let { currentType } = this.state;

		currentType = currentType.toLowerCase();
		type = type.toLowerCase();

		const props = {
			submitMsg: 'Import',
			onSubmit: this.context.submitForm,
			customInputs: this.decideInput
		};

		if (currentType === type && type === 'quiz') return <CreateQuiz {...props} />;
		else if (currentType === type && type === 'question') return <CreateQuestion {...props} />;
		else if (currentType === type && type === 'folder') return <CreateFolder {...props} />;
		else if (currentType === type && type === 'environment') return <CreateEnvironment {...props} />;
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
