import React, { Component } from 'react';

import Manipulator from './Manipulator/Manipulator';
import Displayer from './Displayer/Displayer';
import Detailer from './Detailer/Detailer';
import './Explorer.scss';

class Explorer extends Component {
	state = {
		detailerIndex: 0
	};
	render() {
		const { data, refetchData, totalCount, type, page } = this.props;
		return (
			<div className="Explorer">
				<Detailer data={data[this.state.detailerIndex]} />
				<div className="Displayer_container">
					<Manipulator onApply={refetchData} type={type} />
					<Displayer
						setDetailerIndex={(detailerIndex) => {
							this.setState({ detailerIndex });
						}}
						refetchData={refetchData}
						page={page}
						data={data}
						totalCount={totalCount}
						type={type}
					/>
				</div>
			</div>
		);
	}
}

export default Explorer;
