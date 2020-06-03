import React, { Component } from 'react';
import axios from 'axios';
import CustomList from '../../components/List/List';
import PlayStats from './PlayStats';
import PlaySettings from './PlaySettings';
import GenericButton from '../../components/Buttons/GenericButton';
import Quiz from '../Start/Quiz';

import './Play.scss';

class Play extends Component {
	state = {
		quizzes: [],
		hasStarted: false,
		playsettings: null
	};

	componentDidMount() {
		axios
			.get(`http://localhost:5001/api/v1/quizzes/me?populate=questions&populateFields=type,difficulty`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			})
			.then(({ data: { data } }) => {
				this.setState({
					quizzes: data
				});
			});
	}

	transformList = (data) => {
		return data.map((data, index) => {
			return {
				primary: data.name,
				primaryIcon: 'Quiz',
				key: `${data.name}${index}`,
				secondary: `${data.questions.length} Questions`
			};
		});
	};

	render() {
		const { quizzes, hasStarted } = this.state;

		return (
			<CustomList className="play_list" title={`Your quizzes`} listItems={this.transformList(quizzes)}>
				{({ list, checked }) => {
					return (
						<PlaySettings>
							{({ formData, inputs }) => {
								return !hasStarted ? (
									<div className="play pages">
										{list}
										<PlayStats quizzes={quizzes} selectedQuizzes={checked.map((checked) => quizzes[checked])} />
										<div className="play_button">
											<GenericButton
												text="Play"
												onClick={(e) => (checked.length !== 0 ? this.setState({ hasStarted: true }) : void 0)}
											/>
										</div>
										{inputs}
									</div>
								) : (
									<Quiz settings={formData.values} quizzes={checked.map((index) => quizzes[index])} />
								);
							}}
						</PlaySettings>
					);
				}}
			</CustomList>
		);
	}
}

export default Play;
