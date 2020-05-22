import React, { Component } from 'react';
import DataTable from '../../components/DataTable/DataTable';
import getColoredIcons from '../../Utils/getColoredIcons';
import moment from 'moment';

class ExploreFolders extends Component {
	decideLabel = (name) => {
		return name.split('_').map((value) => value.charAt(0).toUpperCase() + value.substr(1)).join(' ');
	};

	decideColums = () => {
		return [ 'icon', 'created_at', 'name', 'total_quizzes', 'total_questions', 'username' ].map((name) => {
			return {
				name,
				label: this.decideLabel(name),
				filter: true,
				sort: true
			};
		});
	};

	transformData = (data) => {
		return data.map((item, index) => {
			return {
				...item,
				username: item.user.username,
				icon: getColoredIcons('Folder', item.icon.split('_')[0].toLowerCase()),
				created_at: moment(item.created_at).fromNow()
			};
		});
	};

	render() {
		const { decideColums, transformData } = this;
		const { options, data } = this.props;
		return (
			<div>
				<DataTable title={`Folder List`} data={transformData(data)} columns={decideColums()} options={options} />
			</div>
		);
	}
}

export default ExploreFolders;
