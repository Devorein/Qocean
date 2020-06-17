import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';

import InputSelect from '../Input/InputSelect';
import Heatmap from './Heatmap/Heatmap';
import BasicTable from './Table/BasicTable';
import LocalFilter from '../FilterSort/LocalFilter';

import './Visualizer.scss';
class Visualizer extends Component {
	state = {
		view: 'Table'
	};

	decideVisualizer = (contents) => {
		const { view } = this.state;
		const { title } = this.props;

		if (view === 'Table') return <BasicTable title={title} contents={contents} />;
		else if (view === 'Heatmap') return <Heatmap title={title} contents={contents} />;
	};

	render() {
		const { title, classes, children, contents } = this.props;

		const VisualizerView = (
			<InputSelect
				className="Visualizer_View"
				selectItems={[ 'Heatmap', 'Table' ].map((view) => ({ value: view, text: view }))}
				value={this.state.view}
				name="View"
				onChange={(e) => this.setState({ view: e.target.value })}
			/>
		);

		return children ? (
			children({
				VisualizerView,
				Visualizer: <div className="Visualizer">{this.decideVisualizer}</div>
			})
		) : (
			<div className={`Visualizer ${classes.root}`}>
				{title ? <div className="Visualizer_title">{title}</div> : null}

				<LocalFilter contents={contents}>
					{({ LocalFilterSearch, filteredContents }) => {
						return (
							<Fragment>
								{VisualizerView}
								{LocalFilterSearch}
								<div className="Visualizer_Content">{this.decideVisualizer(filteredContents)}</div>
							</Fragment>
						);
					}}
				</LocalFilter>
			</div>
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
