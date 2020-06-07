import React, { Component } from 'react';

import Manipulator from './Manipulator/Manipulator';
import Displayer from './Displayer/Displayer';
import Effector from './Effector/Effector';

class Explorer extends Component {
	render() {
		const { data, refetchData, totalCount, globalEffectors, selectedEffectors } = this.props;
		return (
			<div className="Explorer">
				<Manipulator onApply={refetchData} />
				<Displayer
					data={data}
					totalCount={totalCount}
					globalEffectors={globalEffectors}
					selectedEffectors={selectedEffectors}
				/>
			</div>
		);
	}
}

export default Explorer;
