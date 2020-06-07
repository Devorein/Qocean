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
		selectedIndex: [],
		detailerIndex: 0
	};

	decideDisplayer = () => {
		const { view } = this.state;
		const { indieEffectors } = this.props;
		if (view === 'table') return <TableDisplayer indieEffectors={indieEffectors} />;
		else if (view === 'list') return <ListDisplayer indieEffectors={indieEffectors} />;
		else if (view === 'board') return <BoardDisplayer indieEffectors={indieEffectors} />;
		else if (view === 'gallery') return <GalleryDisplayer indieEffectors={indieEffectors} />;
	};

	render() {
		const { decideDisplayer } = this;
		const { detailerIndex, selectedIndex } = this.state;
		const { globalEffectors, selectedEffectors, data, totalCount } = this.props;
		return (
			<div className="Displayer">
				<Effector
					constantEffectors={[]}
					globalEffectors={globalEffectors}
					selectedEffectors={selectedEffectors}
					totalCount={totalCount}
					selectedIndex={selectedIndex}
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
