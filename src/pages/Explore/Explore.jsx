import React, { Component } from 'react';
import Board from '../../components/Board/Board';

import axios from 'axios';
import plur from 'plur';
import './Explore.scss';

class Explore extends Component {
	state = {
		type: '',
		data: []
	};

	decideSections = (item, type) => {
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
				[ 'source', { anchor: true } ]
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
	};

	refetchData = (type) => {
		axios
			.get(`http://localhost:5001/api/v1/${plur(type, 2)}`)
			.then(({ data }) => {
				this.setState({
					data,
					type
				});
			})
			.catch((err) => {
				console.log(err);
			});
	};

	render() {
		const { type, data } = this.state;
		const headers = [ 'user', 'quiz', 'question', 'folder', 'environment' ];
		return (
			<div className="explore page">
				<Board
					headers={headers}
					page="explore"
					type={type}
					data={data}
					onHeaderClick={this.refetchData}
					sectionDecider={this.decideSections}
				/>
			</div>
		);
	}
}

export default Explore;
