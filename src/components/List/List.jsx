import React, { Component } from 'react';
import axios from 'axios';
import Card from '../Card/Card';
import plur from 'plur';

class List extends Component {
	state = {
		data: []
	};

	componentDidUpdate() {
		axios
			.get(`http://localhost:5001/api/v1/${plur(this.props.type, 2)}`)
			.then(({ data }) => {
				this.setState({
					data
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}
	render() {
		const { data: { data: list = [], success, count } } = this.state;
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
