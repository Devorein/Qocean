import React, { Component } from 'react';
import DataTable from '../../components/DataTable/DataTable';
import moment from 'moment';
import ChipContainer from '../../components/Chip/ChipContainer';
class ExploreQuizzes extends Component {
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
			{ name: 'creator', sort: true, filter: false },
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

	transformData = (data) => {
		return data.map((item, index) => {
			return {
				...item,
				tags: <ChipContainer chips={item.tags} type={'regular'} />,
				creator: item.user.username,
				created_at: moment(item.created_at).fromNow()
			};
		});
	};

	render() {
		const { decideColums, transformData, transformOption } = this;
		const { options, data } = this.props;
		return (
			<div>
				<DataTable
					title={`Quiz List`}
					data={transformData(data)}
					columns={decideColums()}
					options={transformOption(options)}
				/>
			</div>
		);
	}
}

export default ExploreQuizzes;
