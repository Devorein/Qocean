import React, { Component } from 'react';
import axios from 'axios';

class QuizDetails extends Component {
	state = {
		data: []
	};
	componentDidMount() {
		const { quizId } = this.props.match.params;
		axios.get(`http://localhost:5001/api/v1/quizzes?_id=${quizId}`).then((data) => {
			console.log(data);
		});
	}
	render() {
		return <div>Quiz Details</div>;
	}
}

export default QuizDetails;
