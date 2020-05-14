import React, { Component } from 'react';

import FolderCard from '../Card/FolderCard';

class FolderList extends Component {
	render() {
		return (
			<div className="list folder-list">
				{this.props.list.map((item, index) => {
					return (
						<div className="list-item folder-list-item" key={item._id}>
							<FolderCard item={item} index={index} />
						</div>
					);
				})}
			</div>
		);
	}
}

export default FolderList;
