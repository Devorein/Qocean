import React, { Component } from 'react';

class Effector extends Component {
	renderEffectorBottomBar = () => {
		const { totalCount } = this.props;
		return <div>{totalCount}</div>;
	};

	renderEffectorTopBar = () => {
		const { selectedEffectors, globalEffectors, selectedIndex } = this.props;
		return selectedIndex.length > 0
			? selectedEffectors.map((selectedEffector) => selectedEffector(selectedIndex))
			: globalEffectors.map((globalEffector) => globalEffector);
	};

	render() {
		const { renderEffectorTopBar, renderEffectorBottomBar } = this;
		return this.props.children({
			EffectorTopBar: <div className="EffectorTopBar">{renderEffectorTopBar()}</div>,
			EffectorBottomBar: <div className="EffectorBottomBar">{renderEffectorBottomBar()}</div>
		});
	}
}

export default Effector;
