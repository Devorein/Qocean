import React, { Component } from 'react';
import Card from '../../components/Card/Card';

class UserCard extends Component {
	render() {
		let { item, page, index } = this.props;
		return (
			<div className={`card quiz-card ${page}-card ${page}-quiz-card quiz-card-${index} ${page}-quiz-card-${index}`}>
				<Card
					primary={[ [ 'name', { link: `/quiz/${item._id}` } ] ]}
					secondary={[ [ 'username', { link: `/user/${item._id}` } ], [ 'version', { highlight: true } ] ]}
					tertiary={[
						[ 'total_quizzes' ],
						[ 'total_folders' ],
						[ 'total_questions' ],
						[ 'total_environments' ],
						[ 'joined_at' ]
					]}
					type="quiz"
					item={item}
					index={index}
				/>
			</div>
		);
	}
}

export default UserCard;
