import React, { Component } from 'react';

class EnvironmentCard extends Component {
	render() {
		const { item, index } = this.props;
		return (
			<div className="environment-card">
				<img src={item.image} alt={`Environment ${index + 1}`} />
				<span className="environment-card-item-name">{item.name}</span>
			</div>
		);
	}
}

export default EnvironmentCard;
