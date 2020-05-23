import React, { Component } from 'react';
import CreateQuiz from '../Create/CreateQuiz';

class ImportQuizzes extends Component {
	render() {
		const { data, type } = this.props;
		return (
			<div>
				<div>{`Imported ${data.length} ${type.toLowerCase()}`}</div>
				{data.length !== 0 ? <CreateQuiz onSubmit={(e) => {}} /> : null}
			</div>
		);
	}
}

export default ImportQuizzes;
