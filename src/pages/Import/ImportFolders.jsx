import React, { Component, Fragment } from 'react';
import CreateFolder from '../Create/CreateFolder';
import CustomList from '../../components/List/List';

class ImportFolders extends Component {
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
		const { data, type } = this.props;
		return data.length !== 0 ? (
			<div className={`${type}-import-section-form import-section-form`}>
				<CreateFolder submitMsg={'Import'} customInputs={this.decideInput} onSubmit={(e) => {}} />
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
