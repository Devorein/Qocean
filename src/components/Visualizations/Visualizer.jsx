import React, { Component, Fragment } from 'react';

import InputSelect from '../Input/InputSelect';
import Heatmap from './Heatmap/Heatmap';
import BasicTable from './Table/BasicTable';

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
		return this.props.children ? (
			this.props.children({
				ViewInputSelect: (
					<InputSelect
						className="Visualizer_View"
						selectItems={[ 'Heatmap', 'Table' ].map((view) => ({ value: view, text: view }))}
						value={this.state.view}
						name="View"
						onChange={(e) => this.setState({ view: e.target.value })}
					/>
				),
				Visualizer: <div className="Visualizer">{this.decideVisualizer}</div>
			})
		) : (
			<Fragment>
				<InputSelect
					className="Visualizer_View"
					selectItems={[ 'Heatmap', 'Table' ].map((view) => ({ value: view, text: view }))}
					value={this.state.view}
					name="View"
					onChange={(e) => this.setState({ view: e.target.value })}
				/>
				<div className="Visualizer">{this.decideVisualizer()}</div>
			</Fragment>
		);
	}
}

export default Visualizer;
