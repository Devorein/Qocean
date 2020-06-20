import React, { Component } from 'react';
import CustomTabs from '../../components/Tab/Tabs';
import getIcons from '../../Utils/getIcons';

class TabSwitcher extends Component {
	state = {
		type: this.props.type
	};

	switchPage = (page) => {
		const { runBeforeSwitch, runAfterSwitch } = this.props;
		if (runBeforeSwitch) runBeforeSwitch();
		if (runAfterSwitch) runAfterSwitch(page.name);

		this.setState({
			type: page.name
		});
	};

	decideHeaders = () => {
		let { comp } = this.props;
		comp = comp.toLowerCase();
		if (comp === 'fileinput') return [ 'Link', 'Upload' ];
	};

	render() {
		const headers = this.decideHeaders().map((header) => {
			return {
				name: header,
				icon: getIcons({ icon: header })
			};
		});

		const CUSTOM_TABS = (
			<CustomTabs
				against={this.state.type}
				onChange={(e, value) => {
					this.switchPage(headers[value]);
				}}
				height={50}
				headers={headers}
			/>
		);

		return this.props.children({
			CustomTabs: <div className="TabSwitcher">{CUSTOM_TABS}</div>,
			type: this.state.type
		});
	}
}

export default TabSwitcher;
