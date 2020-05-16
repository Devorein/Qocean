import React, { Component } from 'react';
import Board from '../../components/Board/Board';

import decideSections from '../../Utils/decideSections';
import axios from 'axios';
import pluralize from 'pluralize';
import './Explore.scss';

class Explore extends Component {
	state = {
		type: '',
		data: []
	};

	refetchData = (type) => {
		axios
			.get(`http://localhost:5001/api/v1/${pluralize(type, 2)}`)
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

	render() {
		const { type, data } = this.state;
		const headers = [ 'user', 'quiz', 'question', 'folder', 'environment' ];
		return (
			<div className="explore page">
				<Board
					headers={headers}
					page="explore"
					type={type}
					data={data}
					onHeaderClick={this.refetchData}
					sectionDecider={decideSections}
				/>
			</div>
		);
	}
}

export default Explore;
