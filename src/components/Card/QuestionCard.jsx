import React, { Component } from 'react';

class QuestionCard extends Component {
	render() {
		const { item, index } = this.props;
		return (
			<div className="question-card">
				<img src={item.image} alt={`Question ${index + 1}`} />
				<span className="question-card-item-name">{item.name}</span>
			</div>
		);
	}
}

export default QuestionCard;
