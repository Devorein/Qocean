import React, { Component } from 'react';
import DataTable from '../../components/DataTable/DataTable';
import moment from 'moment';
import ChipContainer from '../../components/Chip/ChipContainer';
class SelfQuizzes extends Component {
	decideLabel = (name) => {
		return name.split('_').map((value) => value.charAt(0).toUpperCase() + value.substr(1)).join(' ');
	};

	decideColums = () => {
		return [
			{ name: 'rating', sort: true, filter: true },
			{ name: 'name', sort: true, filter: false },
			{ name: 'subject', sort: true, filter: false },
			{ name: 'average_quiz_time', sort: true, filter: true },
			{ name: 'average_difficulty', sort: true, filter: true },
			{ name: 'tags', sort: false, filter: false },
			{ name: 'source', sort: false, filter: false },
			{ name: 'total_questions', sort: true, filter: true },
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
		const primary = [ 'name', 'public', 'favourite', 'total_questions', 'subject', 'tags' ];

		return {
			exclude,
			primary
		};
	};

	transformData = (data) => {
		return data.map((item, index) => {
			return {
				name: item.name,
				rating: item.rating,
				subject: item.subject,
				average_quiz_time: item.average_quiz_time,
				average_difficulty: item.average_difficulty,
				source: item.source,
				total_questions: item.total_questions,
				public: item.public,
				favourite: item.favourite,
				tags: <ChipContainer chips={item.tags} type={'regular'} />,
				creator: item.user.username,
				created_at: moment(item.created_at).fromNow()
			};
		});
	};

	render() {
		const { decideColums, transformData, transformOption, filterData } = this;
		let { options, data, genericTransformData } = this.props;
		return (
			<DataTable
				title={`Quiz List`}
				data={transformData(genericTransformData(data, filterData))}
				columns={decideColums()}
				options={transformOption(options)}
			/>
		);
	}
}

export default SelfQuizzes;
