import React, { Component } from 'react';
import CreateFolder from '../Create/CreateFolder';

class ImportFolders extends Component {
	render() {
		const { data, type } = this.props;
		return (
			<div>
				<div>{`Imported ${data.length} ${type.toLowerCase()}`}</div>
				{data.length !== 0 ? <CreateFolder onSubmit={(e) => {}} /> : null}
			</div>
		);
	}
}

export default ImportFolders;
