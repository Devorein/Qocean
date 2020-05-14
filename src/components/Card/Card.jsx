import React, { Component } from 'react';

class QuestionCard extends Component {
	render() {
		const { item, index, type } = this.props;
		return (
			<div className={`${type}-card`}>
				<img src={item.image} alt={`${type.charAt(0).toUpperCase() + type.slice(1)} ${index + 1}`} />
				<span className={`${type}-card-item-name`}>{item.name | item.question}</span>
			</div>
		);
	}
}

export default QuestionCard;
