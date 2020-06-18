import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';

import Heatmap from './Heatmap/Heatmap';
import BasicTable from './Table/BasicTable';
import LocalFilter from '../FilterSort/LocalFilter';
import DataView from '../DataView/DataView';

import './Visualizer.scss';
class Visualizer extends Component {
	decideVisualizer = (view, contents) => {
		const { title } = this.props;

		if (view === 'table') return <BasicTable title={title} contents={contents} />;
		else if (view === 'heatmap') return <Heatmap title={title} contents={contents} />;
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
								className="Visualizer_Manip_item Visualizer_Manip_search"
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
}))(Visualizer);
