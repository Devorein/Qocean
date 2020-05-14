import React, { Component } from 'react';
import List from '../components/List/List';

class Explore extends Component {
	state = {
		currentType: 'quiz'
	};

	render() {
		const { currentType } = this.state;
		return (
			<div className="Explore page">
				<div className="explore-types">
					{[ 'Quiz', 'Question', 'Folder', 'Environment', 'User' ].map((type) => {
						return (
							<div
								key={type}
								className={`explore-type explore-type-${type.toLowerCase()}`}
								onClick={(e) => {
									this.setState({
										currentType: type.toLowerCase()
									});
								}}
							>
								{type}
							</div>
						);
					})}
				</div>
				<div className="explore-results">
					<List type={currentType} />
				</div>
			</div>
		);
	}
}

export default Explore;
