import React, { Component } from 'react';
import DataTable from '../../components/DataTable/DataTable';
import moment from 'moment';

class ExploreQuestions extends Component {
	decideLabel = (name) => {
		return name.split('_').map((value) => value.charAt(0).toUpperCase() + value.substr(1)).join(' ');
	};

	decideColums = () => {
		return this.props.cols.concat(
			[
				{ name: 'name', sort: true, filter: false },
				{ name: 'difficulty', sort: true, filter: true },
				{ name: 'type', sort: true, filter: true },
				{ name: 'time_allocated', sort: true, filter: true },
				{ name: 'quiz', sort: true, filter: false },
				{ name: 'creator', sort: true, filter: false },
				{ name: 'created_at', sort: false, filter: false },
				{ name: 'updated_at', sort: false, filter: false }
			].map(({ name, sort, filter }) => {
				return {
					name,
					label: this.decideLabel(name),
					options: {
						filter,
						sort,
						sortDirection: name === this.props.sortCol ? this.props.sortOrder : 'none'
					}
				};
			})
		);
	};

	transformOption = (option) => {
		return option;
	};

	transformData = (data) => {
		return data.map((item, index) => {
			return {
				...item,
				quiz: item.quiz.name,
				creator: item.user.username,
				created_at: moment(item.created_at).fromNow(),
				updated_at: moment(item.updated_at).fromNow()
			};
		});
	};

	render() {
		const { decideColums, transformData, transformOption } = this;
		const { options, data } = this.props;
		return (
			<div>
				<DataTable
					title={`Question List`}
					data={transformData(data)}
					columns={decideColums()}
					options={transformOption(options)}
				/>
			</div>
		);
	}
}

export default ExploreQuestions;
