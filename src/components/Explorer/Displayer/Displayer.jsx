import React, { Component } from 'react';
import TableDisplayer from './TableDisplayer/TableDisplayer';
import ListDisplayer from './ListDisplayer/ListDisplayer';
import BoardDisplayer from './BoardDisplayer/BoardDisplayer';
import GalleryDisplayer from './GalleryDisplayer/GalleryDisplayer';

class Displayer extends Component {
	state = {
		view: 'table'
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
		return <div className="Displayer">{decideDisplayer()}</div>;
	}
}

export default Displayer;
