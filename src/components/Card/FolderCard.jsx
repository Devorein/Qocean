import React, { Component } from 'react';

class FolderCard extends Component {
	render() {
		const { item, index } = this.props;
		return (
			<div className="folder-card">
				<img src={item.image} alt={`Folder ${index + 1}`} />
				<span className="folder-card-item-name">{item.name}</span>
			</div>
		);
	}
}

export default FolderCard;
