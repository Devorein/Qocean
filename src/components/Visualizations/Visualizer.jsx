import React, { Component, Fragment } from 'react';
import { withStyles, withTheme } from '@material-ui/core/styles';

import Heatmap from './Heatmap/Heatmap';
import Bar from './Bar/Bar';
import BasicTable from './Table/BasicTable';
import LocalFilter from '../FilterSort/LocalFilter';
import DataView from '../DataView/DataView';

import './Visualizer.scss';
class Visualizer extends Component {
	decideVisualizer = (view, contents) => {
		const { theme } = this.props;
		let { headers, footers, rows } = contents;
		headers = headers.slice(1).map((header) => header.name);
		const indexBy = 'name';
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
			margin: { left: 200, top: 50, right: 50, bottom: 100 },
			data: rows,
			indexBy,
			keys: headers,
			sizeVariation: 0.5,
			theme: {
				fontFamily: theme.typography.fontFamily,
				fontSize: 14,
				textColor: theme.palette.text.primary,
				fill: theme.palette.text.primary,
				tooltip: {
					container: {
						background: theme.palette.background.dark
					}
				}
			},
			labelTextColor: theme.palette.background.dark
		};

		const toolTipStyle = {
			color: theme.palette.text.primary,
			backgroundColor: theme.palette.background.dark,
			padding: 3
		};

		const props = {
			contents,
			toolTipStyle,
			commonProperties
		};

		if (view === 'table') return <BasicTable contents={contents} />;
		else if (view === 'heatmap') return <Heatmap {...props} />;
		else if (view === 'bar') return <Bar {...props} />;
	};

	render() {
		const { title, classes, contents } = this.props;
		return (
			<DataView DataViewSelectClass="Visualizer_Manip_item Visualizer_Manip_view" displayComponent={'visualizer'}>
				{({ DataViewSelect, DataViewState }) => {
					return (
						<div className={`Visualizer ${classes.root}`}>
							{title ? <div className="Visualizer_title">{title}</div> : null}
							<LocalFilter
								contents={contents}
								LocalFilterSearchClass="Visualizer_Manip_item Visualizer_Manip_search"
								fixedTargetType={'number'}
								checkAgainst={contents.headers.map(({ name }) => name)}
							>
								{({ LocalFilterSearch, filteredContents }) => {
									return (
										<Fragment>
											<div className="Visualizer_Manip">
												{DataViewSelect}
												{LocalFilterSearch}
											</div>
											<div className="Visualizer_Content">
												{this.decideVisualizer(DataViewState.view, filteredContents)}
											</div>
										</Fragment>
									);
								}}
							</LocalFilter>
						</div>
					);
				}}
			</DataView>
		);
	}
}

export default withStyles((theme) => ({
	root: {
		'& .Visualizer_title': {
			backgroundColor: theme.palette.background.dark
		}
	}
}))(withTheme(Visualizer));
