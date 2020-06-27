import React, { Component } from 'react';
import FormFiller from '../../pages/FormFiller/FormFiller';
import { AppContext } from '../../context/AppContext';
import PageSwitcher from '../../components/PageSwitcher/PageSwitcher';
import './Create.scss';

class Create extends Component {
	static contextType = AppContext;
	render() {
		return (
			<PageSwitcher page="create">
				{({ CustomTabs, type }) => (
					<div className="Create page">
						{CustomTabs}
						<FormFiller
							useModal={false}
							user={this.props.user}
							submitMsg={'Create'}
							data={null}
							type={type}
							page={'Create'}
						/>
					</div>
				)}
			</PageSwitcher>
		);
	}
}

export default Create;
