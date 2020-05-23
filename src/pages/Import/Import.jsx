import React, { Component } from 'react';
import CustomTabs from '../../components/Tab/Tabs';
import { withRouter } from 'react-router-dom';
class Import extends Component {
	switchPage = (page) => {
		this.props.history.push(`/${page.link}`);
	};

	render() {
		const { match: { params: { type } } } = this.props;

		const headers = [ 'Quiz', 'Question', 'Folder', 'Environment' ].map((header) => {
			return {
				name: header,
				link: `import/${header}`
			};
		});

		return (
			<div className="Import page">
				<CustomTabs
					against={type}
					onChange={(e, value) => {
						this.switchPage(headers[value]);
					}}
					height={50}
					headers={headers}
				/>
			</div>
		);
	}
}

export default withRouter(Import);
