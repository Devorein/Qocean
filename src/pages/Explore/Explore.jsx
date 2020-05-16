import React, { Component } from 'react';
import Card from '../../components/Card/Card';

import axios from 'axios';
import plur from 'plur';
import './Explore.scss';

function decideSections(item, type) {
	let primary = [],
		secondary = [],
		tertiary = [];

	if (type === 'user') {
		primary = [ [ 'name', { link: `/quizzes/${item._id}` } ] ];
		secondary = [ [ 'username', { link: `/users/${item._id}` } ], [ 'version', { highlight: true } ] ];
		tertiary = [
			[ 'total_quizzes' ],
			[ 'total_folders' ],
			[ 'total_questions' ],
			[ 'total_environments' ],
			[ 'joined_at' ]
		];
	} else if (type === 'quiz') {
		primary = [ [ 'name', { link: `/quizzes/${item._id}` } ] ];
		secondary = [
			[ 'username', { link: `/users/${item.user._id}`, value: `by ${item.user.username}` } ],
			[ 'subject', { highlight: true } ],
			[ 'tags' ]
		];
		tertiary = [
			[ 'average_quiz_time', { value: item['average_quiz_time'] + 's' } ],
			[ 'average_difficulty' ],
			[ 'total_questions' ],
			[ 'created_at' ],
			[ 'source' ]
		];
	} else if (type === 'question') {
		primary = [
			[ 'question', { link: `/questions/${item._id}`, style: { fontSize: '20px' }, value: `${item.question}?` } ]
		];
		secondary = [
			[ 'user', { link: `/users/${item.user._id}`, value: `${item.user.username}` } ],
			[ 'quiz', { link: `/quizzes/${item.quiz._id}`, value: `${item.quiz.name}` } ],
			[ 'type', { highlight: true } ]
		];
		tertiary = [ [ 'difficulty' ], [ 'time_allocated', { value: item['time_allocated'] + 's' } ], [ 'created_at' ] ];
	} else if (type === 'folder') {
		primary = [ [ 'name', { link: `/folders/${item._id}`, style: { fontSize: '20px' } } ] ];
		secondary = [ [ 'user', { link: `/users/${item.user._id}`, value: `${item.user.username}` } ] ];
		tertiary = [ [ 'total_quizzes' ], [ 'total_questions' ], [ 'created_at' ] ];
	} else if (type === 'environment') {
		primary = [ [ 'name', { link: `/environments/${item._id}`, style: { fontSize: '20px' } } ] ];
		secondary = [ [ 'user', { link: `/users/${item.user._id}`, value: `${item.user.username}` } ] ];
		tertiary = [ [ 'theme' ], [ 'animation' ], [ 'sound' ], [ 'default_quiz_time' ], [ 'created_at' ] ];
	}

	return {
		primary,
		secondary,
		tertiary
	};
}

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
						data.data.map((item, index) => {
							const { primary, secondary, tertiary } = decideSections(item, currentType);
							return (
								<Card
									primary={primary}
									secondary={secondary}
									tertiary={tertiary}
									item={item}
									type={currentType}
									index={index}
									page="explore"
									key={item._id}
								/>
							);
						})
					) : (
						<div className="no-data">{`No ${plur(currentType)} found`}</div>
					)}
				</div>
			</div>
		);
	}
}

export default Explore;
