import React, { Component } from 'react';
import { Bar } from '@nivo/bar';

class CustomBar extends Component {
	render() {
		const { toolTipStyle, commonProperties } = this.props;

		return (
			<div className="Heatmap">
				<Bar
					{...commonProperties}
					axisTop={{
						orient: 'top',
						tickSize: 0,
						tickPadding: 5,
						legend: '',
						legendOffset: 36
					}}
					axisLeft={{
						format: (value) => {
							if (Number.isInteger(value)) return value;
							else return null;
						}
					}}
					groupMode="grouped"
					tooltip={(value) => (
						<span style={toolTipStyle}>
							{value.data.name} - {value.id}: {value.value}
						</span>
					)}
				/>
			</div>
		);
	}
}

export default CustomBar;
