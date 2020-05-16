import React, { Component } from 'react';
import Card from '../../components/Card/Card';

import axios from 'axios';
import plur from 'plur';
import './Explore.scss';

class Explore extends Component {
	state = {
		currentType: 'quiz',
		data: []
	};

	refetchData = (type) => {
		axios
			.get(`http://localhost:5001/api/v1/${plur(type, 2)}`)
			.then(({ data }) => {
				this.setState({
					data,
					currentType: type.toLowerCase()
				});
			})
			.catch((err) => {
				console.log(err);
			});
	};

	render() {
		const { currentType, data } = this.state;

		return (
			<div className="Explore page">
				<div className="explore-types">
					{[ 'user', 'quiz', 'question', 'folder', 'environment' ].map((type) => {
						return (
							<span
								key={type}
								className={`explore-type explore-type-${type.toLowerCase()} ${this.state.currentType === type
									? 'selected-type'
									: ''}`}
								onClick={(e) => {
									this.refetchData(type);
								}}
							>
								{type.charAt(0).toUpperCase() + type.slice(1)}
							</span>
						);
					})}
				</div>
				<div className="explore-results">
					{data.data ? (
						data.data.map((item, index) => (
							<Card item={item} type={currentType} index={index} page="explore" key={item._id} />
						))
					) : (
						<div className="no-data">{`No ${plur(currentType)} found`}</div>
					)}
				</div>
			</div>
		);
	}
}

export default Explore;
