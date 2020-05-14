import React, { Component } from 'react';
import List from '../components/List/List';
import axios from 'axios';
import plur from 'plur';

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
					{[ 'Quiz', 'Question', 'Folder', 'Environment', 'User' ].map((type) => {
						return (
							<div
								key={type}
								className={`explore-type explore-type-${type.toLowerCase()}`}
								onClick={(e) => {
									this.refetchData(type);
								}}
							>
								{type}
							</div>
						);
					})}
				</div>
				<div className="explore-results">
					<List type={currentType} data={data} />
				</div>
			</div>
		);
	}
}

export default Explore;
