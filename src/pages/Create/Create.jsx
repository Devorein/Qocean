import React, { Component } from 'react';
import Form from '../../components/Form/Form';

class Create extends Component {
	render() {
		const headers = [ 'Quiz', 'Question', 'Folder', 'Environment' ];
		return (
			<div className="Create page">
				<Form headers={headers} />
			</div>
		);
	}
}

export default Create;
