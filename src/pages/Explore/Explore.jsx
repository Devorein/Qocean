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
					{[ 'User', 'Quiz', 'Question', 'Folder', 'Environment' ].map((type) => {
						return (
							<span
								key={type}
								className={`explore-type explore-type-${type.toLowerCase()}`}
								onClick={(e) => {
									this.refetchData(type);
								}}
							>
								{type}
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
