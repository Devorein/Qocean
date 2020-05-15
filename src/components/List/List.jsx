import React, { Component, Fragment } from 'react';
import Card from '../Card/Card';
import plur from 'plur';

class List extends Component {
	render() {
		const { type, data: { data: list = [], success, count }, page } = this.props;
		return (
			<div className={`list ${page}-list ${type}-list ${page}-${type}-list`}>
				{list.length !== 0 ? (
					list.map((item, index) => {
						return <Card item={item} index={index} type={type} key={item._id} page={page} />;
					})
				) : (
					<div className="no-data">{`No ${plur(type)} found`}</div>
				)}
			</div>
		);
	}
}

export default List;
