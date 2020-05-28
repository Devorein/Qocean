import React, { Component } from 'react';

class Start extends Component {
	render() {
		const { quizzes } = this.props;
		return (
			<div className={`start`}>
				{quizzes.map((quiz) => {
					return <div>{quiz.name}</div>;
				})}
			</div>
		);
	}
}

export default Start;
