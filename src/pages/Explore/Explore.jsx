import React, { Component } from 'react';
import QuizCard from '../../resources/Quiz/QuizCard';
import UserCard from '../../resources/User/UserCard';
import QuestionCard from '../../resources/Question/QuestionCard';
import EnvironmentCard from '../../resources/Environment/EnvironmentCard';
import FolderCard from '../../resources/Folder/FolderCard';

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

	decideCard = (item, index) => {
		const { currentType } = this.state;
		const page = 'explore';
		switch (currentType) {
			case 'quiz':
				return <QuizCard key={item._id} item={item} index={index} page={page} />;
			case 'user':
				return <UserCard key={item._id} item={item} index={index} page={page} />;
			case 'folder':
				return <FolderCard key={item._id} item={item} index={index} page={page} />;
			case 'question':
				return <QuestionCard key={item._id} item={item} index={index} page={page} />;
			case 'environment':
				return <EnvironmentCard key={item._id} item={item} index={index} page={page} />;
			default:
				return <QuizCard item={item} index={index} page={page} />;
		}
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
						data.data.map((item, index) => this.decideCard(item, index))
					) : (
						<div className="no-data">{`No ${plur(currentType)} found`}</div>
					)}
				</div>
			</div>
		);
	}
}

export default Explore;
