import React, { Component } from 'react';
import SSFilterSort from '../../FilterSort/SSFilterSort';
import './Manipulator.scss';
class Manipulator extends Component {
	render() {
		const { onApply, type, page, DataViewSelect } = this.props;

		return (
			<SSFilterSort onApply={onApply} type={type} page={page}>
				{({ SSFilterSort, filter_sort }) => {
					return this.props.children({
						Manipulator: (
							<div className="Manipulator">
								{DataViewSelect}
								{SSFilterSort}
							</div>
						),
						filter_sort
					});
				}}
			</SSFilterSort>
		);
	}
}

export default Manipulator;
