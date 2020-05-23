import React, { Component } from 'react';
import CreateFolder from '../Create/CreateFolder';
import CustomList from '../../components/List/List';

class ImportFolders extends Component {
	transformList = (data) => {
		return data.map((data) => {
			return {
				primary: data.name,
				primaryIcon: 'folderClose',
				_id: data.name
			};
		});
	};

	renderList = () => {
		const { data, type } = this.props;
		return data.length !== 0 ? (
			<CustomList title={`Imported ${type}(s)`} listItems={this.transformList(data)} />
		) : (
			<div>Nothing imported</div>
		);
	};

	renderForm = () => {
		const { data, type } = this.props;
		return data.length !== 0 ? <CreateFolder onSubmit={(e) => {}} /> : <div>Nothing imported</div>;
	};

	render() {
		const { renderList, renderForm } = this;
		const { data, type } = this.props;
		return (
			<div>
				<div>{`Imported ${data.length} ${type.toLowerCase()}`}</div>
				{renderList()}
				{renderForm()}
			</div>
		);
	}
}

export default ImportFolders;
