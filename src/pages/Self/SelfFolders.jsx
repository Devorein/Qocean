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
			{ name: 'total_quizzes', sort: true, filter: true },
			{ name: 'total_questions', sort: true, filter: true },
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
		const obj = {};
		const exlcude = [ '__v', 'user', '_id' ];
		Object.entries(item).forEach(([ key, value ]) => {
			if (!exlcude.includes(key)) obj[key] = value.toString();
		});
		return obj;
	};

	transformData = (data) => {
		return data.map((item, index) => {
			return {
				...item,
				creator: item.user.username,
				icon: getColoredIcons('Folder', item.icon.split('_')[0].toLowerCase()),
				created_at: moment(item.created_at).fromNow()
			};
		});
	};

	render() {
		const { decideColums, transformData, transformOption } = this;
		const { options, data } = this.props;
		return (
			<DataTable
				title={`Folder List`}
				data={transformData(data)}
				columns={decideColums()}
				options={transformOption(options)}
			/>
		);
	}
}

export default SelfFolders;
