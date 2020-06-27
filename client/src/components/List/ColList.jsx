import React, { Component } from 'react';
import { difference } from 'lodash';

import MultiSelect from '../Input/MultiSelect';
import { AppContext } from '../../context/AppContext';
import sectorizeData from '../../Utils/sectorizeData';

class ColList extends Component {
	static contextType = AppContext;
	state = {
		cols: [],
		removed_cols: []
	};

	UNSAFE_componentWillReceiveProps(props) {
		const cols = [];
		const { data, page, type } = props;
		if (data.length > 0) {
			Object.keys(
				sectorizeData(data[0], type, {
					authenticated: this.context.user,
					flatten: true,
					page
				})
			).forEach((col) => {
				if (col !== '_id') cols.push(col);
			});

			this.setState({
				cols
			});
		}
	}

	render() {
		const { props: { ColListSelectClass, children } } = this;
		const { cols, removed_cols } = this.state;
		return children({
			ColListSelect: (
				<MultiSelect
					customRenderValue={(selected) => `${selected ? selected.length : 0} Shown`}
					useSwitch={true}
					labelClass={`${ColListSelectClass || ''} `}
					name="Toggle Properties"
					selected={difference(cols, removed_cols)}
					handleChange={(e, child) => {
						let selected_cols = e.target.value;
						if (e.altKey) selected_cols = [ child.props.value ];
						else if (e.shiftKey) {
							const { menuitem } = child.props;
							selected_cols = [];
							Array(menuitem + 1).fill(0).forEach((_, index) => selected_cols.push(this.state.cols[index]));
						}
						this.setState({
							removed_cols: difference(cols, selected_cols)
						});
					}}
					items={
						cols ? (
							cols.map((col) => ({
								_id: col,
								name: col.split('_').map((chunk) => chunk.charAt(0).toUpperCase() + chunk.substr(1)).join(' ')
							}))
						) : (
							[]
						)
					}
				/>
			),
			ColListState: this.state
		});
	}
}

export default ColList;
