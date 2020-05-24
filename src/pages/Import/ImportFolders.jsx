import React, { Component, Fragment } from 'react';
import CreateFolder from '../Create/CreateFolder';
import CustomList from '../../components/List/List';
import { AppContext } from '../../context/AppContext';
import DeleteIcon from '@material-ui/icons/Delete';
import PublishIcon from '@material-ui/icons/Publish';
class ImportFolders extends Component {
	static contextType = AppContext;

	state = {
		selectedIndex: 0
	};

	transformList = (data) => {
		return data.map((data) => {
			return {
				primary: data.name,
				primaryIcon: 'folderclose'
			};
		});
	};

	renderList = () => {
		const { data, type } = this.props;
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
								this.props.deleteItems(this.CustomList.state.checked);
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
												_this.CreateFolder.InputForm.Form.SubmitButton.click();
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

	decideInput = (inputs) => {
		return inputs.map((input) => {
			return {
				...input,
				defaultValue: this.props.data[this.state.selectedIndex][input.name]
					? this.props.data[this.state.selectedIndex][input.name]
					: input.defaultValue
			};
		});
	};

	renderForm = () => {
		const { data, type, onSubmit } = this.props;
		return data.length !== 0 ? (
			<div className={`${type}-import-section-form import-section-form`}>
				<CreateFolder
					ref={(r) => (this.CreateFolder = r)}
					submitMsg={'Import'}
					customInputs={this.decideInput}
					onSubmit={onSubmit}
				/>
			</div>
		) : (
			<div>Nothing imported</div>
		);
	};

	render() {
		const { renderList, renderForm } = this;
		return (
			<Fragment>
				{renderList()}
				{renderForm()}
			</Fragment>
		);
	}
}

export default ImportFolders;
