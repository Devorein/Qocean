import React, { Component, Fragment } from 'react';
import axios from 'axios';
import Board from '../../components/Board/Board';
import plur from 'plur';
import Card from '../../components/Card/Card';

import './Detail.scss';
class Detail extends Component {
	state = {
		type: '',
		data: [],
		cardData: []
	};

	decideSections = (item, type) => {
		let primary = [],
			secondary = [],
			tertiary = [],
			cards = [];

		if (type === 'users') {
			primary = [ [ 'image' ], [ 'name' ] ];
			secondary = [ [ 'version', { highlight: true } ], [ 'username' ], [ 'email' ] ];
			tertiary = [ [ 'total_environments' ], [ 'total_folders' ], [ 'total_questions' ], [ 'total_quizzes' ] ];
			cards = [ 'quiz', 'question', 'folder', 'environment' ];
		} else if (type === 'quizzes') {
		} else if (type === 'questions') {
		} else if (type === 'folders') {
		} else if (type === 'environments') {
		}
		return {
			primary,
			secondary,
			tertiary,
			cards
		};
	};

	componentDidMount() {
		const { type, id } = this.props.match.params;
		axios.get(`http://localhost:5001/api/v1/${type}?_id=${id}`).then((data) => {
			this.setState({
				cardData: data.data
			});
		});
	}

	getDetails = () => {
		const { type } = this.props.match.params;

		const { cardData } = this.state;
		const { primary, secondary, tertiary } = this.decideSections(cardData, type);
		if (cardData.data) {
			return (
				<Fragment>
					<Card
						primary={primary}
						type={type}
						secondary={secondary}
						tertiary={tertiary}
						item={cardData.data}
						page="detail"
						image={true}
					/>
				</Fragment>
			);
		}
	};

	refetchData = (type) => {
		const { id } = this.props.match.params;

		axios
			.get(`http://localhost:5001/api/v1/${type}?_id=${id}`)
			.then(({ data }) => {
				this.setState({
					data,
					type
				});
			})
			.catch((err) => {
				console.log(err);
			});
	};

	decideHeaders = (type) => {
		if (type === 'users') return [ 'Quiz', 'Question', 'Folder', 'Environment' ];
		else if (type === 'quizzes') return [ 'Quiz' ];
		else if (type === 'questions') return [];
		else if (type === 'folders') return [];
		else if (type === 'environments') return [];
	};

	render() {
		const { type } = this.props.match.params;
		const headers = this.decideHeaders(type);
		return (
			<div className="detail page">
				{this.getDetails()}
				{/* <Board
					header={headers}
					page="detail"
					type={type}
					onHeaderClick={this.refetchData}
					sectionDecider={this.decideSections}
				/> */}
			</div>
		);
	}
}

export default Detail;
