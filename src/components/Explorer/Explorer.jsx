import React, { Component } from 'react';

import Manipulator from './Manipulator/Manipulator';
import Displayer from './Displayer/Displayer';

class Explorer extends Component {
	render() {
		const { data, refetchData, totalCount, globalEffectors, selectedEffectors, type } = this.props;
		return (
			<div className="Explorer">
				<Manipulator onApply={refetchData} type={type} />
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
