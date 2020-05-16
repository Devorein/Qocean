import React, { Component, Fragment } from 'react';
import axios from 'axios';
import Board from '../../components/Board/Board';
import pluralize from 'pluralize';
import Card from '../../components/Card/Card';
import decideSections from '../../Utils/decideSections';

import './Detail.scss';
class Detail extends Component {
	state = {
		type: '',
		data: [],
		cardData: []
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
		if (cardData.data) {
			const { primary, secondary, tertiary } = decideSections(cardData.data, pluralize.singular(type));
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
						extraClass={'detail-card-top'}
					/>
				</Fragment>
			);
		}
	};

	refetchData = (type) => {
		const { type: rel, id } = this.props.match.params;
		axios
			.get(`http://localhost:5001/api/v1/${pluralize(type, 2)}?${pluralize.singular(rel)}=${id}`)
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

	decideHeaders = () => {
		const { type } = this.props.match.params;
		if (type === 'users') return [ 'quiz', 'question', 'folder', 'environment' ];
		else if (type === 'quizzes') return [ 'question' ];
		else if (type === 'questions') return [ 'user' ];
		else if (type === 'folders') return [ 'quiz', 'user' ];
		else if (type === 'environments') return [ 'user' ];
	};

	render() {
		const { type } = this.props.match.params;
		const headers = this.decideHeaders();
		return (
			<div className="detail page">
				{this.getDetails()}
				<Board
					headers={headers}
					page="detail"
					type={this.state.type}
					data={this.state.data}
					onHeaderClick={this.refetchData}
					sectionDecider={decideSections}
					noData={`Click above tabs to view data about this ${pluralize.singular(type)}`}
				/>
			</div>
		);
	}
}

export default Detail;
