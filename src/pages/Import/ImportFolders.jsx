import React, { Component, Fragment } from 'react';
import CreateFolder from '../Create/CreateFolder';

import { AppContext } from '../../context/AppContext';
class ImportFolders extends Component {
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
