import React, { Component } from 'react';
import { Link } from 'react-router-dom';

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
				<div className="card-tertiary user-card-tertiary">
					<div className="user-card-tertiary-item user-card-tertiary-foldersCount">
						<div className="user-card-tertiary-item-key">Total Folders</div>
						<div className="user-card-tertiary-item-value">{item.foldersCount}s</div>
					</div>
					<div className="user-card-tertiary-item user-card-tertiary-questionsCount">
						<div className="user-card-tertiary-item-key">Total Questions</div>
						<div className="user-card-tertiary-item-value">{item.questionsCount}</div>
					</div>
					<div className="user-card-tertiary-item user-card-tertiary-quizzesCount">
						<div className="user-card-tertiary-item-key">Total Quizzes</div>
						<div className="user-card-tertiary-item-value">{item.quizzesCount}</div>
					</div>
					<div className="user-card-tertiary-item user-card-tertiary-environmentsCount">
						<div className="user-card-tertiary-item-key">Total Environments</div>
						<div className="user-card-tertiary-item-value">{item.environmentsCount}</div>
					</div>
					<div className="user-card-tertiary-item user-card-tertiary-source">
						<div className="user-card-tertiary-item-key">Source: </div>
						<div className="user-card-tertiary-item-value">{item.source}</div>
					</div>
				</div>
			</div>
		);
	}
}

export default UserCard;
