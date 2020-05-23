import React, { Component } from 'react';
import CreateQuestion from '../Create/CreateQuestion';

class ImportQuestions extends Component {
	render() {
		const { data, type } = this.props;
		return (
			<div>
				<div>{`Imported ${data.length} ${type.toLowerCase()}`}</div>
				{data.length !== 0 ? <CreateQuestion onSubmit={(e) => {}} /> : null}
			</div>
		);
	}
}

export default ImportQuestions;
