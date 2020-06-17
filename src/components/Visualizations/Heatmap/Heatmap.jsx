import React, { Component } from 'react';
import { HeatMap } from '@nivo/heatmap';
import { withTheme } from '@material-ui/core/styles';

class CustomHeatmap extends Component {
	render() {
		const { contents, indexBy = 'name', theme } = this.props;
		let { headers, footers, rows } = contents;
		headers = headers.slice(1).map((header) => header.name);

		const obj = {
			[indexBy]: 0
		};
		headers.forEach((header, index) => {
			obj[header] = footers[index];
		});

		rows.concat(obj);

		const commonProperties = {
			width: 750,
			height: 750,
			margin: { left: 200, top: 50, right: 50 },
			data: rows,
			indexBy,
			keys: headers,
			sizeVariation: 0.5
		};

		const customTheme = {
			fontFamily: theme.typography.fontFamily,
			fontSize: 14,
			textColor: theme.palette.text.primary,
			fill: theme.palette.text.primary,
			tooltip: {
				container: {
					background: theme.palette.background.dark
				}
			}
		};

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
					theme={customTheme}
					labelTextColor={theme.palette.text.primary}
					tooltip={({ xKey, yKey, value }) => (
						<span
							style={{
								color: theme.palette.text.primary,
								backgroundColor: theme.palette.background.dark,
								padding: 3
							}}
						>
							{yKey} - {xKey}: {value}
						</span>
					)}
				/>
			</div>
		);
	}
}

export default withTheme(CustomHeatmap);
