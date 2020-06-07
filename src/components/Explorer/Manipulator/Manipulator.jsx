import React, { Component } from 'react';
import SSFilterSort from '../../FilterSort/SSFilterSort';

class Manipulator extends Component {
	render() {
		const { onApply, type } = this.props;
		return (
			<div className="Manipulator">
				<SSFilterSort passFSAsProp={false} onApply={onApply} type={type} />
			</div>
		);
	}
}

export default Manipulator;
