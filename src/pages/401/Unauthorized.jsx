import React, { Component } from 'react';

class Unauthorized extends Component {
	render() {
		return (
			<div className="unauthorized pages">
				<div className="unauthorized-title">401 Unauthorized</div>
				<div className="unauthorized-text">Sorry you're unauthorized to view this page</div>
			</div>
		);
	}
}

export default Unauthorized;
