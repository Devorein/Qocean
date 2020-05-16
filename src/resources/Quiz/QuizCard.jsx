import React, { Component } from 'react';
import Card from '../../components/Card/Card';

import './QuizCard.scss';

class QuizCard extends Component {
	render() {
		let { item, page, index } = this.props;
		return (
			<div className={`card quiz-card ${page}-card ${page}-quiz-card quiz-card-${index} ${page}-quiz-card-${index}`}>
				<Card
					primary={[ [ 'name', { link: `/quiz/${item._id}` } ] ]}
					secondary={[
						[ 'username', { link: `/user/${item.user._id}`, value: `by ${item.user.username}` } ],
						[ 'subject' ],
						[ 'tags' ]
					]}
					tertiary={[
						[ 'average_quiz_time' ],
						[ 'average_difficulty' ],
						[ 'total_questions' ],
						[ 'created_at' ],
						[ 'source' ]
					]}
					type="quiz"
					item={item}
					index={index}
				/>
			</div>
		);
	}
}

export default QuizCard;
