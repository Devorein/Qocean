import React, { Component } from 'react';
import axios from 'axios';

class Play extends Component {
	state = {
		quizzes: this.props.user.quizzes
	};

	render() {
		const { quizzes } = this.state;
		return (
			<div className="play pages">
				{quizzes.length > 0 ? (
					quizzes.map((quiz) => {
						return <div key={quiz._id}>{quiz.name}</div>;
					})
				) : (
					<div>No Quiz found</div>
				)}
			</div>
		);
	}
}

export default Play;
