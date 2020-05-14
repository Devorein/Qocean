import React, { Component } from 'react';
import axios from 'axios';
import QuizCard from '../Card/QuizCard';

class QuizList extends Component {
	state = {
		data: []
	};

	componentDidMount() {
		axios
			.get('http://localhost:5001/api/v1/quizes')
			.then(({ data }) => {
				this.setState({
					data
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}
	render() {
		const { data: { data: list = [], success, count } } = this.state;

		return (
			<div className="list quiz-list">
				{list.length !== 0 ? (
					list.map((item, index) => {
						return (
							<div className="list-item quiz-list-item" key={item._id}>
								<QuizCard item={item} index={index} />
							</div>
						);
					})
				) : (
					<div>No quizes found</div>
				)}
			</div>
		);
	}
}

export default QuizList;
