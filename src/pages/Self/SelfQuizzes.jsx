import React, { Component } from 'react';
import DataTable from '../../components/DataTable/DataTable';
import moment from 'moment';
import ChipContainer from '../../components/Chip/ChipContainer';
class SelfQuizzes extends Component {
	decideLabel = (name) => {
		return name.split('_').map((value) => value.charAt(0).toUpperCase() + value.substr(1)).join(' ');
	};

	decideColums = () => {
		return this.props.cols
			.concat([
				{ name: 'ratings', sort: true, filter: true },
				{ name: 'name', sort: true, filter: false },
				{ name: 'subject', sort: true, filter: false },
				{ name: 'average_quiz_time', sort: true, filter: true },
				{ name: 'average_difficulty', sort: true, filter: true },
				{ name: 'tags', sort: false, filter: false },
				{ name: 'source', sort: false, filter: false },
				{ name: 'watchers', sort: true, filter: false },
				{ name: 'total_questions', sort: true, filter: true },
				{ name: 'public', sort: true, filter: true },
				{ name: 'favourite', sort: true, filter: true },
				{ name: 'created_at', sort: false, filter: false },
				{ name: 'updated_at', sort: false, filter: false }
			])
			.map(({ name, sort, filter }) => {
				return {
					name,
					label: this.decideLabel(name),
					options: {
						filter,
						sort,
						sortDirection: name === this.props.sortCol ? this.props.sortOrder : 'none'
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
				...item,
				name: <div style={{ maxHeight: 100, overflowY: 'auto' }}>{item.name}</div>,
				watchers: item.watchers.length,
				tags: <ChipContainer chips={item.tags} type={'regular'} height={100} />,
				creator: item.user.username,
				created_at: moment(item.created_at).fromNow(),
				updated_at: moment(item.updated_at).fromNow()
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
