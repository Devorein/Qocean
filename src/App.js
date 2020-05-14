import React, { Component } from 'react';
import axios from 'axios';
import QuizList from './components/List/QuizList';

class App extends Component {
	state = {
		quizes: []
	};
	componentDidMount() {
		axios.get('http://localhost:5001/api/v1/quizes').then((res) => {
			this.setState({
				quizes: res.data.data
			});
		});
	}
	render() {
		return (
			<ul>
				<QuizList list={this.state.quizes} />
			</ul>
		);
	}
}

export default App;
