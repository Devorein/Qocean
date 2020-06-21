import React, { Component } from 'react';
import CustomTabs from '../../components/Tab/Tabs';
import Icon from '../../components/Icon/Icon';

class TabSwitcher extends Component {
	state = {
		type: this.props.type
	};

	switchTab = (tab) => {
		const { runBeforeSwitch, runAfterSwitch } = this.props;
		if (runBeforeSwitch) runBeforeSwitch();
		if (runAfterSwitch) runAfterSwitch(tab.name);

		this.setState({
			type: tab.name
		});
	};

	decideHeaders = () => {
		let { comp } = this.props;
		comp = comp.toLowerCase();
		if (comp === 'fileinput') return [ 'Link', 'Upload' ];
		else if (comp === 'play') return [ 'Quiz', 'Folder' ];
	};

	render() {
		const headers = this.decideHeaders().map((header) => {
			return {
				name: header,
				icon: <Icon icon={header} />
			};
		});

		const CUSTOM_TABS = (
			<CustomTabs
				against={this.state.type}
				onChange={(e, value) => {
					this.switchTab(headers[value]);
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
