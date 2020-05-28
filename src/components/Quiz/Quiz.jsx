import React, { Component } from 'react';

class Quiz extends Component {
	render() {
		const { question } = this.props;
		return (
			<div>
				<div>{question.name}</div>
				{question.options.map((option) => {
					return <div>{option}</div>;
				})}
			</div>
		);
	}
}

export default Quiz;
