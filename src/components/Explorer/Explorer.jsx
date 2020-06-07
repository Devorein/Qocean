import React, { Component } from 'react';

import Manipulator from './Manipulator/Manipulator';
import Displayer from './Displayer/Displayer';

class Explorer extends Component {
	render() {
		const { data, refetchData, totalCount, type, page } = this.props;
		return (
			<div className="Explorer">
				<Manipulator onApply={refetchData} type={type} />
				<Displayer refetchData={refetchData} page={page} data={data} totalCount={totalCount} type={type} />
			</div>
		);
	}
}

export default Explorer;
