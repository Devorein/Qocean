import React, { Component } from 'react';
import DataTable from '../../components/DataTable/DataTable';
import getColoredIcons from '../../Utils/getColoredIcons';
import moment from 'moment';

class SelfFolders extends Component {
	decideLabel = (name) => {
		return name.split('_').map((value) => value.charAt(0).toUpperCase() + value.substr(1)).join(' ');
	};

	decideColums = () => {
		return [
			{ name: 'icon', sort: false, filter: false },
			{ name: 'name', sort: true, filter: false },
			{ name: 'public', sort: true, filter: true },
			{ name: 'favourite', sort: true, filter: true },
			{ name: 'total_quizzes', sort: true, filter: true },
			{ name: 'total_questions', sort: true, filter: true },
			{ name: 'created_at', sort: false, filter: false }
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
		});
	};

	transformOption = (option) => {
		return option;
	};

	filterData = (item) => {
		const exclude = [ '__v', 'user', '_id' ];
		const primary = [ 'name', 'public', 'favourite' ];

		return {
			exclude,
			primary
		};
	};

	transformData = (data) => {
		return data.map((item, index) => {
			return {
				icon: getColoredIcons('Folder', item.icon.split('_')[0].toLowerCase()),
				name: item.name,
				public: item.public,
				favourite: item.favourite,
				total_quizzes: item.total_quizzes,
				total_questions: item.total_questions,
				created_at: moment(item.created_at).fromNow()
			};
		});
	};

	render() {
		const { decideColums, transformData, transformOption, filterData } = this;
		const { options, data, genericTransformData } = this.props;
		return (
			<DataTable
				title={`Folder List`}
				data={transformData(genericTransformData(data, filterData))}
				columns={decideColums()}
				options={transformOption(options)}
			/>
		);
	}
}

export default SelfFolders;
