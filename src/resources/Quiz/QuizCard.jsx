import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CardSecondary from '../../components/Card/CardSecondary';
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

				<CardSecondary
					items={[
						[ 'username', { link: `/user/${item.user._id}`, value: `by ${item.user.username}` } ],
						[ 'subject' ],
						[ 'tags' ]
					]}
					type="quiz"
					item={item}
				/>
				<CardTertiary
					items={[
						[ 'average_quiz_time' ],
						[ 'average_difficulty' ],
						[ 'total_questions' ],
						[ 'created_at' ],
						[ 'source' ]
					]}
					type="quiz"
					item={item}
				/>
			</div>
		);
	}
}

export default QuizCard;
