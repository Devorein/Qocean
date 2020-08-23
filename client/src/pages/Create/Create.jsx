import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import CustomTabs from '../../components/Tab/Tabs';
import FormFiller from '../../pages/FormFiller/FormFiller';
import { AppContext } from '../../context/AppContext';

import './Create.scss';

class Create extends Component {
	static contextType = AppContext;

	state = {
		resource: this.context.user.current_environment.default_create_landing || 'Quiz'
	};

	render () {
		const headers = [ 'Quiz', 'Question', 'Folder', 'Environment' ].map((header) => {
			return {
				name: header,
				link: `create/${header}`
			};
		});

		return (
			<div className="Create page">
				<CustomTabs
					against={this.state.resource}
					onChange={(e, value) => {
						this.setState({
							resource: headers[value].name
						});
					}}
					height={50}
					headers={headers}
				/>
				<FormFiller
					useModal={false}
					user={this.props.user}
					submitMsg={'Create'}
					data={null}
					type={this.state.resource}
					page={'Create'}
				/>
			</div>
		);
	}
}

export default withRouter(Create);
