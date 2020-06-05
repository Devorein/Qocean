import React, { Component } from 'react';
import DataTable from '../../components/DataTable/DataTable';
import getColoredIcons from '../../Utils/getColoredIcons';
import moment from 'moment';

class SelfFolders extends Component {
	decideLabel = (name) => {
		return name.split('_').map((value) => value.charAt(0).toUpperCase() + value.substr(1)).join(' ');
	};

	decideColums = () => {
		return this.props.cols
			.concat([
				{ name: 'icon' },
				{ name: 'name' },
				{ name: 'public' },
				{ name: 'favourite' },
				{ name: 'watchers' },
				{ name: 'total_quizzes' },
				{ name: 'total_questions' },
				{ name: 'created_at' },
				{ name: 'updated_at' }
			])
			.map(({ name }) => {
				return {
					name,
					label: this.decideLabel(name)
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
				...item,
				icon: getColoredIcons('Folder', item.icon.split('_')[0].toLowerCase()),
				watchers: item.watchers.length,
				created_at: moment(item.created_at).fromNow(),
				updated_at: moment(item.updated_at).fromNow()
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
