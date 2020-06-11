import React, { Component } from 'react';
import SSFilterSort from '../../FilterSort/SSFilterSort';

class Manipulator extends Component {
	render() {
		const { onApply, type } = this.props;

		return (
			<SSFilterSort passFSAsProp={true} onApply={onApply} type={type}>
				{({ SSFilterSort, filter_sort }) => {
					return this.props.children({
						Manipulator: <div className="Manipulator">{SSFilterSort}</div>,
						filter_sort
					});
				}}
			</SSFilterSort>
		);
	}
}

export default Manipulator;
