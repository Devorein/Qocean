import React, { Component } from 'react';
import { HeatMap } from '@nivo/heatmap';

class CustomHeatmap extends Component {
	render() {
		const { contents, indexBy = 'name' } = this.props;
		let { headers, footers, rows } = contents;
		headers = headers.slice(1).map((header) => header.name);

		const commonProperties = {
			width: 900,
			height: 500,
			margin: { top: 60, right: 80, bottom: 60, left: 80 },
			data: rows,
			indexBy,
			keys: headers
		};

		return (
			<div>
				<HeatMap
					{...commonProperties}
					// cellShape={CustomCell}
					forceSquare={true}
					axisTop={{
						orient: 'top',
						tickSize: 5,
						tickPadding: 5,
						tickRotation: -55,
						legend: '',
						legendOffset: 36
					}}
				/>
			</div>
		);
	}
}

export default CustomHeatmap;
