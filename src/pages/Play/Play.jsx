import React, { Component } from 'react';
import axios from 'axios';
import CustomList from '../../components/List/List';
import PlayStats from './PlayStats';
import PlaySettings from './PlaySettings';
import DeleteIcon from '@material-ui/icons/Delete';
import GenericButton from '../../components/Buttons/GenericButton';
import Quiz from '../Start/Quiz';

import './Play.scss';

class Play extends Component {
	state = {
		quizzes: [],
		selectedIndex: 0,
		checked: [],
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

	setChecked = (checked) => {
		this.setState({
			checked
		});
	};

	render() {
		const { quizzes, hasStarted } = this.state;
		return !hasStarted ? (
			<div className="play pages">
				<CustomList
					setChecked={this.setChecked}
					className="play_list"
					containsCheckbox={true}
					ref={(r) => (this.CustomList = r)}
					title={`Your quizzes`}
					listItems={this.transformList(quizzes)}
					onClick={(selectedIndex, e) => {
						this.setState({
							selectedIndex
						});
					}}
					selectedIcons={[
						<DeleteIcon
							key={'delete'}
							onClick={(e) => {
								this.deleteItems(this.CustomList.state.checked);
								this.CustomList.state.checked = [];
							}}
						/>
					]}
				/>
				<PlayStats
					quizzes={this.state.quizzes}
					selectedQuizzes={this.state.checked.map((checked) => quizzes[checked])}
				/>
				<PlaySettings
					customHandler={({ validation, randomized_quiz, randomized_question }, setValues, e) => {
						this.setState({
							playsettings: {
								validation,
								randomized_quiz,
								randomized_question
							}
						});
					}}
				/>
				<div className="play_button">
					<GenericButton text="Play" onClick={(e) => this.setState({ hasStarted: true })} />{' '}
				</div>
			</div>
		) : (
			<Quiz
				settings={this.state.playsettings ? this.state.playsettings : null}
				quizzes={this.CustomList.state.checked.map((index) => quizzes[index])}
			/>
		);
	}
}

export default Play;
