import React, { Component } from 'react';
import CreateEnvironment from '../Create/CreateEnvironment';

class ImportEnvironments extends Component {
	render() {
		const { data, type } = this.props;
		return (
			<div>
				<div>{`Imported ${data.length} ${type.toLowerCase()}`}</div>
				{data.length !== 0 ? <CreateEnvironment onSubmit={(e) => {}} /> : null}
			</div>
		);
	}
}

export default ImportEnvironments;
