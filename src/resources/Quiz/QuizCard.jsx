import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './QuizCard.scss';

class QuizCard extends Component {
	render() {
		let { item, page, index } = this.props;
		return (
			<div className={`card quiz-card ${page}-card ${page}-quiz-card quiz-card-${index} ${page}-quiz-card-${index}`}>
				<div className="quiz-card-primary card-primary">{item.name}</div>

				<div className="card-secondary quiz-card-secondary quiz-card-secondary-user">
					<Link to={`/user/${item.user._id}`}>by {item.user.username}</Link>
				</div>
				<div className="card-secondary quiz-card-secondary quiz-card-secondary-subject">{item.subject}</div>
				<div className="card-secondary quiz-card-secondary quiz-card-secondary-tags">
					{item.tags.map((tag, index) => (
						<span key={tag} className={`quiz-card-secondary-tags-item`}>
							{tag}
						</span>
					))}
				</div>
				<div className="quiz-card-tertiary">
					<div className="quiz-card-tertiary-item quiz-card-tertiary-averageTimeAllocated">
						Average Quiz Time {item.averageTimeAllocated}
					</div>
					<div className="quiz-card-tertiary-item quiz-card-tertiary-averageDifficulty">
						Average Quiz Difficulty {item.averageDifficulty}
					</div>
					<div className="quiz-card-tertiary-item quiz-card-tertiary-questionsCount">
						Total Questions {item.questionsCount}
					</div>
					<div className="quiz-card-tertiary-item quiz-card-tertiary-createdAt">Created At {item.createdAt}</div>
					<div className="quiz-card-tertiary-item quiz-card-tertiary-source">Source: {item.source}</div>
				</div>
			</div>
		);
	}
}

export default QuizCard;
