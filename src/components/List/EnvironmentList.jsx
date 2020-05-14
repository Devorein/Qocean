import React, { Component } from 'react';

import EnvironmentCard from '../Card/EnvironmentCard';

class EnvironmentList extends Component {
	render() {
		return (
			<div className="list environment-list">
				{this.props.list.map((item, index) => {
					return (
						<div className="list-item environment-list-item" key={item._id}>
							<EnvironmentCard item={item} index={index} />
						</div>
					);
				})}
			</div>
		);
	}
}

export default EnvironmentList;
