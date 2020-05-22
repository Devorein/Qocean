import React, { Component } from 'react';
import DataTable from '../../components/DataTable/DataTable';
import getColoredIcons from '../../Utils/getColoredIcons';
import moment from 'moment';

class ExploreUsers extends Component {
	decideLabel = (name) => {
		return name.split('_').map((value) => value.charAt(0).toUpperCase() + value.substr(1)).join(' ');
	};

	decideColums = () => {
		return [
			{ name: 'name', sort: true, filter: false },
			{ name: 'username', sort: true, filter: false },
			{ name: 'image', sort: false, filter: false },
			{ name: 'total_quizzes', sort: true, filter: true },
			{ name: 'total_questions', sort: true, filter: true },
			{ name: 'total_folders', sort: true, filter: true },
			{ name: 'total_environments', sort: true, filter: true },
			{ name: 'joined_at', sort: false, filter: false },
			{ name: 'version', sort: true, filter: true }
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
				joined_at: moment(item.joined_at).fromNow()
			};
		});
	};

	render() {
		const { decideColums, transformData, transformOption } = this;
		const { options, data } = this.props;
		return (
			<div>
				<DataTable
					title={`User List`}
					data={transformData(data)}
					columns={decideColums()}
					options={transformOption(options)}
				/>
			</div>
		);
	}
}

export default ExploreUsers;
