import React, { Component } from 'react';
import { HeatMap } from '@nivo/heatmap';

class CustomHeatmap extends Component {
	render() {
		const { toolTipStyle, commonProperties } = this.props;

		return (
			<div className="Heatmap">
				<HeatMap
					{...commonProperties}
					forceSquare={true}
					axisTop={{
						orient: 'top',
						tickSize: 0,
						tickPadding: 5,
						legend: '',
						legendOffset: 36
					}}
					tooltip={({ xKey, yKey, value }) => (
						<span style={toolTipStyle}>
							{yKey} - {xKey}: {value}
						</span>
					)}
				/>
			</div>
		);
	}
}

export default CustomHeatmap;
