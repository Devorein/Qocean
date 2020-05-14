import React, { Component } from 'react';

import QuizCard from '../Card/QuizCard';

class QuizList extends Component {
	render() {
		return (
			<div className="list quiz-list">
				{this.props.list.map((item, index) => {
					return (
						<div className="list-item quiz-list-item" key={item._id}>
							<QuizCard item={item} index={index} />
						</div>
					);
				})}
			</div>
		);
	}
}

export default QuizList;
