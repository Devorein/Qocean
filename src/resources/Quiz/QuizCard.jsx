import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './QuizCard.scss';

class QuizCard extends Component {
	render() {
		let { item, page, index } = this.props;
		return (
			<div className={`card quiz-card ${page}-card ${page}-quiz-card quiz-card-${index} ${page}-quiz-card-${index}`}>
				<div className="quiz-card-primary card-primary">
					<Link className="card-primary quiz-card-primary-item quiz-card-primary-name" to={`/quiz/${item._id}`}>
						{item.name}
					</Link>
				</div>

				<div className="card-secondary quiz-card-secondary">
					<Link
						className="card-secondary quiz-card-secondary-item quiz-card-secondary-user"
						to={`/user/${item.user._id}`}
					>
						by {item.user.username}
					</Link>
					<div className="card-secondary-item quiz-card-secondary-item quiz-card-secondary-subject">{item.subject}</div>
					<div className="card-secondary-item quiz-card-secondary-item quiz-card-secondary-tags">
						{item.tags.map((tag, index) => (
							<span key={tag} className={`quiz-card-secondary-tags-item`}>
								{tag}
							</span>
						))}
					</div>
				</div>
				<div className="card-tertiary quiz-card-tertiary">
					<div className="quiz-card-tertiary-item quiz-card-tertiary-averageTimeAllocated">
						<div className="quiz-card-tertiary-item-key">Average Quiz Time</div>
						<div className="quiz-card-tertiary-item-value">{item.averageTimeAllocated}s</div>
					</div>
					<div className="quiz-card-tertiary-item quiz-card-tertiary-averageDifficulty">
						<div className="quiz-card-tertiary-item-key">Average Quiz Difficulty</div>
						<div className="quiz-card-tertiary-item-value">{item.averageDifficulty}</div>
					</div>
					<div className="quiz-card-tertiary-item quiz-card-tertiary-questionsCount">
						<div className="quiz-card-tertiary-item-key">Total Questions </div>
						<div className="quiz-card-tertiary-item-value">{item.questionsCount}</div>
					</div>
					<div className="quiz-card-tertiary-item quiz-card-tertiary-createdAt">
						<div className="quiz-card-tertiary-item-key">Created At</div>
						<div className="quiz-card-tertiary-item-value">{item.createdAt}</div>
					</div>
					<div className="quiz-card-tertiary-item quiz-card-tertiary-source">
						<div className="quiz-card-tertiary-item-key">Source: </div>
						<div className="quiz-card-tertiary-item-value">{item.source}</div>
					</div>
				</div>
			</div>
		);
	}
}

export default QuizCard;
