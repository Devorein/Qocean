import React, { Component } from 'react';

class ListDisplayer extends Component {
	renderListDisplayerTertiary = (data) => {
		delete data.name;
		delete data.subject;
		delete data.tags;

		return Object.entries(data).map(([ key, value ], index) => (
			<span className="ListDisplayer_item_part ListDisplayer_item_part--tertiary" key={`${key}${index}`}>
				{value}
			</span>
		));
	};
	renderListDisplayer = () => {
		const { data, authenticated, type } = this.props;
		// return shaveData(data, type, { purpose: 'display', authenticated }).map((data) => {
		// 	return (
		// 		<div className="ListDisplayer_item" key={data._id}>
		// 			<span className="ListDisplayer_item_part ListDisplayer_item_part--primary">{data.name}</span>
		// 			<span className="ListDisplayer_item_part_container">
		// 				<span className="ListDisplayer_item_part ListDisplayer_item_part--secondary">{data.subject}</span>
		// 				<span className="ListDisplayer_item_part ListDisplayer_item_part--secondary">{data.tags}</span>
		// 			</span>
		// 			<span className="ListDisplayer_item_part_container">{this.renderListDisplayerTertiary(data)}</span>
		// 		</div>
		// 	);
		// });
	};
	render() {
		return <div className="ListDisplayer">{this.renderListDisplayer()}</div>;
	}
}

export default ListDisplayer;
