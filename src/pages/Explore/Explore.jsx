import React, { Component } from 'react';
import List from '../../components/List/List';
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
				<List type={currentType} data={data} page="explore" />
			</div>
		);
	}
}

export default Explore;
