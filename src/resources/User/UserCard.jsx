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
					{[
						[ 'Total Quizzes', 'quizzesCount' ],
						[ 'Total Folders', 'foldersCount' ],
						[ 'Total Questions', 'questionsCount' ],
						[ 'Total Environments', 'environmentsCount' ],
						[ 'Joined At', 'createdAt' ]
					].map(([ text, key ], index) => {
						return (
							<div
								className={`card-tertiary-item user-card-tertiary-item user-card-tertiary-${key}`}
								key={`${item[key]}${index}`}
							>
								<div className={`card-tertiary-item-key user-card-tertiary-item-key`}>{text}</div>
								<div className={`card-tertiary-item-value user-card-tertiary-item-value`}>{item[key]}s</div>
							</div>
						);
					})}
				</div>
			</div>
		);
	}
}

export default UserCard;
