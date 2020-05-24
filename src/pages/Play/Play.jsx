import React, { Component } from 'react';
import axios from 'axios';
import CustomList from '../../components/List/List';
import DeleteIcon from '@material-ui/icons/Delete';
import GenericButton from '../../components/Buttons/GenericButton';
import './Play.scss';

class Play extends Component {
	state = {
		quizzes: [],
		selectedIndex: 0
	};

	componentDidMount() {
		axios
			.get(`http://localhost:5001/api/v1/quizzes/me`, {
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
		const { quizzes } = this.state;
		return (
			<div className="play pages">
				<CustomList
					containsCheckbox={true}
					ref={(r) => (this.CustomList = r)}
					title={`Your quizzes`}
					listItems={this.transformList(this.state.quizzes)}
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
				<GenericButton text="Play" />
			</div>
		);
	}
}

export default Play;
