import React, { Component } from 'react';
import Card from '../Card/Card';
import plur from 'plur';

class List extends Component {
	render() {
		const { data: { data: list = [], success, count } } = this.props;
		const { type } = this.props;
		return (
			<div className={`list ${type}-list`}>
				{list.length !== 0 ? (
					list.map((item, index) => {
						return (
							<div className={`list-item ${type}-list-item`} key={item._id}>
								<Card item={item} index={index} type={type} />
							</div>
						);
					})
				) : (
					<div>{`No ${plur(type)} found`}</div>
				)}
			</div>
		);
	}
}

export default List;
