import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CardTertiary from '../../components/Card/CardTertiary';

class UserCard extends Component {
	render() {
		let { item, page, index } = this.props;

		return (
			<div className={`card user-card ${page}-card ${page}-user-card user-card-${index} ${page}-user-card-${index}`}>
				<div className="card-primary user-card-primary">
					<div className="card-primary-item user-card-primary-item user-card-primary-name">{item.name}</div>
				</div>
				<div className="card-secondary user-card-secondary">
					<Link
						className="card-secondary-item user-card-secondary-item user-card-secondary-username"
						to={`/user/${item._id}`}
					>
						{item.username}
					</Link>
					<div className="card-secondary-item user-card-secondary-item user-card-secondary-version">{item.version}</div>
				</div>
				<CardTertiary
					items={[
						[ 'total_quizzes' ],
						[ 'total_folders' ],
						[ 'total_questions' ],
						[ 'total_environments' ],
						[ 'joined_at' ]
					]}
					type="user"
					item={item}
				/>
			</div>
		);
	}
}

export default UserCard;
