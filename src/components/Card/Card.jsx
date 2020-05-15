import React, { Component, Fragment } from 'react';

class QuestionCard extends Component {
	flattenObject = (obj) => {
		const { type } = this.props;
		const entries = Object.entries(obj);
		return entries.map(([ key, value ], index) => {
			if (Object.prototype.toString.call(value) !== '[object Object]' && !Array.isArray(value))
				return (
					<div className={`${type}-${key}`} key={`${type}-${key}-${index}`}>
						<div className={`${type}-${key}-key`}>{key}</div>
						<div className={`${type}-${key}-value`}>{value}</div>
					</div>
				);
		});
	};
	render() {
		const { item, index, type, page } = this.props;
		return (
			<div className={`card ${page}-card ${page}-${type}-card ${type}-card ${type}-card-${index}`}>
				{this.flattenObject(item)}
			</div>
		);
	}
}

export default QuestionCard;
