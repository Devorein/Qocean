import React, { Component } from 'react';

class QuizCard extends Component {
	render() {
		const { item, index } = this.props;
		return (
			<div className="quiz-card">
				<img src={item.image} alt={`Quiz ${index + 1}`} />
				<span className="quiz-card-item-name">{item.name}</span>
				<span className="quiz-card-item-questionCount">{item.questionCount} question(s)</span>
				<span className="quiz-card-item-rating">{item.rating}</span>
				<span className="quiz-card-item-averageDifficulty">{item.averageDifficulty}</span>
				<span className="quiz-card-item-averageTimeAllocated">{item.averageTime} secs</span>
				<span className="quiz-card-item-subject">{item.subject}</span>
				<span className="quiz-card-item-createdAt">{item.createdAt}</span>
				{item.tags.map((tag) => <span key={`${item._id}${tag}`}>{tag}</span>)}
			</div>
		);
	}
}

export default QuizCard;
