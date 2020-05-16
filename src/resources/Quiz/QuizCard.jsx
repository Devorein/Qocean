import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CardTertiary from '../../components/Card/CardTertiary';
import './QuizCard.scss';

class QuizCard extends Component {
	render() {
		let { item, page, index } = this.props;
		return (
			<div className={`card quiz-card ${page}-card ${page}-quiz-card quiz-card-${index} ${page}-quiz-card-${index}`}>
				<div className="card-primary quiz-card-primary">
					<Link className="card-primary-item quiz-card-primary-item quiz-card-primary-name" to={`/quiz/${item._id}`}>
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
				<CardTertiary
					items={[
						[ 'Average Quiz Time', 'averageTimeAllocated' ],
						[ 'Average Quiz Difficulty', 'averageDifficulty' ],
						[ 'Total Questions', 'total_questions' ],
						[ 'Created At', 'createdAt' ],
						[ 'Source', 'source' ]
					]}
					type="quiz"
					item={item}
				/>
			</div>
		);
	}
}

export default QuizCard;
