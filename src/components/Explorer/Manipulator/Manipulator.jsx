import React, { Component } from 'react';
import SSFilterSort from '../../FilterSort/SSFilterSort';

class Manipulator extends Component {
	render() {
		const { onApply, type, page } = this.props;

		return (
			<SSFilterSort passFSAsProp={true} onApply={onApply} type={type} page={page}>
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
