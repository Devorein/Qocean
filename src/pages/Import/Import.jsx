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
import ChipContainer from '../../components/Chip/ChipContainer';

import './Import.scss';

class Import extends Component {
	static contextType = AppContext;

	state = {
		data: [],
		inputs: [],
		currentType: '',
		selectedIndex: 0
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

	decideInput = (inputs) => {
		const { currentType } = this.state;
		if (currentType === 'folder' || currentType === 'environment') {
			return inputs.map((input) => {
				return {
					...input,
					defaultValue: this.state.data[this.state.selectedIndex][input.name]
						? this.state.data[this.state.selectedIndex][input.name]
						: input.defaultValue
				};
			});
		} else if (currentType === 'quiz') {
			return inputs.map((input) => {
				if (input.name === 'tags')
					return {
						...input
					};
				else
					return {
						...input,
						defaultValue: this.state.data[this.state.selectedIndex][input.name]
							? this.state.data[this.state.selectedIndex][input.name]
							: input.defaultValue
					};
			});
		}
	};

	renderForm = () => {
		const { data } = this.state;
		const { match: { params: { type } } } = this.props;

		return data.length !== 0 ? (
			<div className={`${type}-import-section-form import-section-form`}>{this.decideForm()}</div>
		) : (
			<div>Nothing imported</div>
		);
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
						<PublishIcon
							key={'publish'}
							onClick={(e) => {
								let _this = this;
								this.CustomList.state.checked.forEach((checked, index) => {
									setTimeout(() => {
										this.setState(
											{
												selectedIndex: checked
											},
											() => {
												_this.Create.InputForm.Form.SubmitButton.click();
											}
										);
									}, 2500 * index);
								});
							}}
						/>
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
			ref: (r) => (this.Create = r),
			onSubmit: this.context.submitForm,
			customInputs: this.decideInput
		};

		if (currentType === type && type === 'quiz') return <CreateQuiz {...props} ref={(r) => (this.Create = r)} />;
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
