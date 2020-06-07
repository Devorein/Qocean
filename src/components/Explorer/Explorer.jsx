import React, { Component } from 'react';

import Manipulator from './Manipulator/Manipulator';
import Displayer from './Displayer/Displayer';

class Explorer extends Component {
	render() {
		const { data, refetchData } = this.props;
		return (
			<div className="Explorer">
				<Manipulator onApply={refetchData} />
				<Displayer data={data} />
			</div>
		);
	}
}

export default Explorer;
