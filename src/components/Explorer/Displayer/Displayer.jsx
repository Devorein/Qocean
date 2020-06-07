import React, { Component, Fragment } from 'react';
import TableDisplayer from './TableDisplayer/TableDisplayer';
import ListDisplayer from './ListDisplayer/ListDisplayer';
import BoardDisplayer from './BoardDisplayer/BoardDisplayer';
import GalleryDisplayer from './GalleryDisplayer/GalleryDisplayer';
import Effector from '../Effector/Effector';
import Detailer from '../Detailer/Detailer';

class Displayer extends Component {
	state = {
		view: 'table',
		selectedRows: [],
		detailerIndex: 0
	};

	decideDisplayer = () => {
		const { view } = this.state;
		if (view === 'table') return <TableDisplayer />;
		else if (view === 'list') return <ListDisplayer />;
		else if (view === 'board') return <BoardDisplayer />;
		else if (view === 'gallery') return <GalleryDisplayer />;
	};

	render() {
		const { decideDisplayer } = this;
		const { detailerIndex } = this.state;
		const { globalEffectors, selectedEffectors, data, totalCount } = this.props;
		return (
			<div className="Displayer">
				<Effector
					constantEffectors={[]}
					globalEffectors={globalEffectors}
					selectedEffectors={selectedEffectors}
					totalCount={totalCount}
				>
					{({ EffectorTopBar, EffectorBottomBar }) => {
						return (
							<Fragment>
								{EffectorTopBar}
								{decideDisplayer()}
								{EffectorBottomBar}
							</Fragment>
						);
					}}
				</Effector>
				<Detailer data={data[detailerIndex]} />
			</div>
		);
	}
}

export default Displayer;
