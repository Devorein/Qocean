import React, { Component } from 'react';

import InputSelect from '../Input/InputSelect';
import { AppContext } from '../../context/AppContext';

class DataView extends Component {
	static contextType = AppContext;

	state = {
		view: (() => {
			const { displayComponent, page = '' } = this.props;
			const pageprop = `default_${page.toLowerCase()}_view`;
			const currentenvpageprop = this.context.user.current_environment[pageprop];
			if (this.context.user && displayComponent === 'displayer')
				return currentenvpageprop ? currentenvpageprop.toLowerCase() : 'list';
			else if (this.context.user && displayComponent === 'visualizer')
				return currentenvpageprop ? currentenvpageprop.toLowerCase() : 'table';
		})()
	};

	render() {
		const { props: { children, DataViewSelectClass, prefix, displayComponent } } = this;
		return children({
			DataViewSelect: (
				<InputSelect
					className={`${DataViewSelectClass || ''} ${prefix ? prefix + '_select' : ''} DataView_select`}
					name="Data view"
					value={this.state.view}
					onChange={(e) => {
						this.setState({ view: e.target.value });
					}}
					selectItems={(displayComponent === 'displayer'
						? [ 'table', 'list', 'board', 'gallery' ]
						: [ 'table', 'heatmap' ]).map((value) => ({
						value,
						text: value.charAt(0).toUpperCase() + value.substr(1)
					}))}
				/>
			),
			DataViewState: this.state
		});
	}
}

export default DataView;
