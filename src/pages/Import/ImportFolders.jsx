import React, { Component, Fragment } from 'react';
import CreateFolder from '../Create/CreateFolder';
import CustomList from '../../components/List/List';

class ImportFolders extends Component {
	transformList = (data) => {
		return data.map((data) => {
			return {
				primary: data.name,
				primaryIcon: 'folderclose',
				_id: data.name
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
				/>
			</div>
		) : (
			<div>Nothing imported</div>
		);
	};

	renderForm = () => {
		const { data, type } = this.props;
		return data.length !== 0 ? (
			<div className={`${type}-import-section-form import-section-form`}>
				<CreateFolder onSubmit={(e) => {}} />
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
