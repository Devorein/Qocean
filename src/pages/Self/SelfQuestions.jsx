import React, { Component } from 'react';
import DataTable from '../../components/DataTable/DataTable';
import moment from 'moment';

class SelfQuestions extends Component {
	decideLabel = (name) => {
		return name.split('_').map((value) => value.charAt(0).toUpperCase() + value.substr(1)).join(' ');
	};

	decideColums = () => {
		return [
			{ name: 'question', sort: true, filter: false },
			{ name: 'difficulty', sort: true, filter: true },
			{ name: 'type', sort: true, filter: true },
			{ name: 'time_allocated', sort: true, filter: true },
			{ name: 'quiz', sort: true, filter: false },
			{ name: 'public', sort: true, filter: true },
			{ name: 'favourite', sort: true, filter: true },
			{ name: 'created_at', sort: false, filter: false }
		].map(({ name, sort, filter }) => {
			return {
				name,
				label: this.decideLabel(name),
				options: {
					filter,
					sort
				}
			};
		});
	};

	transformOption = (option) => {
		return option;
	};

	filterData = (item) => {
		const exclude = [ '__v', 'user', '_id' ];
		const primary = [ 'question', 'public', 'favourite' ];

		return {
			exclude,
			primary
		};
	};

	transformData = (data) => {
		return data.map((item, index) => {
			return {
				question: item.name,
				quiz: item.quiz.name,
				created_at: moment(item.created_at).fromNow(),
				difficulty: item.difficulty,
				type: item.type,
				time_allocated: item.time_allocated,
				public: item.public,
				favourite: item.favourite
			};
		});
	};

	render() {
		const { decideColums, transformData, transformOption, filterData } = this;
		const { options, data, genericTransformData } = this.props;
		return (
			<DataTable
				title={`Question List`}
				data={transformData(genericTransformData(data, filterData))}
				columns={decideColums()}
				options={transformOption(options)}
			/>
		);
	}
}

export default SelfQuestions;
