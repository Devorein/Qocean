import React, { Component, Fragment } from 'react';
import axios from 'axios';
import Card from '../../components/Card/Card';

import './Detail.scss';
class Detail extends Component {
	state = {
		data: [],
		currentType: ''
	};
	decideSections = (type) => {
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
				data
			});
		});
	}
	render() {
		const { type } = this.props.match.params;
		const { primary, secondary, tertiary, cards } = this.decideSections(type);
		const { data } = this.state.data;
		if (data) {
			return (
				<div className="Detail page">
					<div className={`${type}-detail`}>
						<Card primary={primary} secondary={secondary} tertiary={tertiary} item={data.data} page="detail" />
					</div>
					<div className="detail-types">
						{cards.map((type) => {
							return (
								<span
									key={type}
									className={`detail-type detail-type-${type.toLowerCase()} ${this.state.currentType === type
										? 'selected-type'
										: ''}`}
									onClick={(e) => {
										this.setState({
											currentType: type.toLowerCase()
										});
									}}
								>
									{type.charAt(0).toUpperCase() + type.slice(1)}
								</span>
							);
						})}
					</div>
				</div>
			);
		} else return <div>Error</div>;
	}
}

export default Detail;
