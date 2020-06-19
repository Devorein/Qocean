import React, { Component } from 'react';

import InputSelect from '../Input/InputSelect';
import { AppContext } from '../../context/AppContext';

class DataView extends Component {
	static contextType = AppContext;

	state = {
		view: (() => {
			const { displayComponent, page = '' } = this.props;
			const pageprop = `default_${page.toLowerCase()}_view`;
			const currentenvpageprop = this.context.user ? this.context.user.current_environment[pageprop] : null;
			if (this.context.user && displayComponent === 'displayer')
				return currentenvpageprop ? currentenvpageprop.toLowerCase() : 'list';
			else if (this.context.user && displayComponent === 'visualizer')
				return currentenvpageprop ? currentenvpageprop.toLowerCase() : 'table';
			else if (this.context.user && displayComponent === 'explorer')
				return currentenvpageprop ? currentenvpageprop.toLowerCase() : 'right';
			else return 'list';
		})()
	};

	decideView = () => {
		const { displayComponent } = this.props;
		let viewItems = [];
		if (displayComponent === 'displayer') viewItems.push('table', 'list', 'board', 'gallery');
		else if (displayComponent === 'visualizer') viewItems.push('table', 'heatmap', 'bar');
		else if (displayComponent === 'explorer') viewItems.push('left', 'right');
		return viewItems.map((value) => ({
			value,
			text: value.charAt(0).toUpperCase() + value.substr(1)
		}));
	};

	render() {
		const { props: { children, DataViewSelectClass, prefix, displayComponent } } = this;
		return children({
			DataViewSelect: (
				<InputSelect
					className={`${DataViewSelectClass || ''} ${prefix ? prefix + '_select' : ''} DataView_select`}
					name={`${displayComponent.charAt(0).toUpperCase() + displayComponent.substr(1)} View`}
					value={this.state.view}
					onChange={(e) => {
						this.setState({ view: e.target.value });
					}}
					selectItems={this.decideView()}
				/>
			),
			DataViewState: this.state
		});
	}
}

export default DataView;
