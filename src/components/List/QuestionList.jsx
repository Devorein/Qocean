import React, { Component } from 'react';

import QuestionCard from '../Card/QuestionCard';

class QuestionList extends Component {
	render() {
		return (
			<div className="list question-list">
				{this.props.list.map((item, index) => {
					return (
						<div className="list-item question-list-item" key={item._id}>
							<QuestionCard item={item} index={index} />
						</div>
					);
				})}
			</div>
		);
	}
}

export default QuestionList;
