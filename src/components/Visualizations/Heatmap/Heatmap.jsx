import React, { Component } from 'react';
import { HeatMap } from '@nivo/heatmap';

const CustomCell = ({ value, x, y, width, height, color, opacity, borderWidth, borderColor, textColor }) => (
	<g transform={`translate(${x}, ${y})`}>
		<path
			transform={`rotate(${value < 50 ? 180 : 0})`}
			fill={color}
			fillOpacity={opacity}
			strokeWidth={borderWidth}
			stroke={borderColor}
			d={`
              M0 -${Math.round(height / 2)}
              L${Math.round(width / 2)} ${Math.round(height / 2)}
              L-${Math.round(width / 2)} ${Math.round(height / 2)}
              L0 -${Math.round(height / 2)}
          `}
		/>
		<text dominantBaseline="central" textAnchor="middle" style={{ fill: textColor }} dy={value < 50 ? -6 : 6}>
			{value}
		</text>
	</g>
);

class CustomHeatmap extends Component {
	render() {
		const { keys, data, indexBy = 'name' } = this.props;
		const commonProperties = {
			width: 900,
			height: 500,
			margin: { top: 60, right: 80, bottom: 60, left: 80 },
			data,
			indexBy,
			keys
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
