import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import InputSelect from '../Input/InputSelect';
import Heatmap from './Heatmap/Heatmap';
import BasicTable from './Table/BasicTable';

import './Visualizer.scss';
class Visualizer extends Component {
	state = {
		view: 'Table'
	};

	decideVisualizer = () => {
		const { view } = this.state;
		const { contents, title } = this.props;

		if (view === 'Table') return <BasicTable title={title} contents={contents} />;
		else if (view === 'Heatmap') return <Heatmap title={title} contents={contents} />;
	};

	render() {
		const { title, classes } = this.props;

		const VisualizerView = (
			<InputSelect
				className="Visualizer_View"
				selectItems={[ 'Heatmap', 'Table' ].map((view) => ({ value: view, text: view }))}
				value={this.state.view}
				name="View"
				onChange={(e) => this.setState({ view: e.target.value })}
			/>
		);

		return this.props.children ? (
			this.props.children({
				VisualizerView,
				Visualizer: <div className="Visualizer">{this.decideVisualizer}</div>
			})
		) : (
			<div className={`Visualizer ${classes.root}`}>
				{title ? <div className="Visualizer_title">{this.props.title}</div> : null}
				{VisualizerView}
				<div className="Visualizer_Content">{this.decideVisualizer()}</div>
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
