import React, { Component } from 'react';
import DataTable from '../../components/DataTable/DataTable';
import moment from 'moment';
import getColoredIcons from '../../Utils/getColoredIcons';

class SelfEnvironments extends Component {
	decideLabel = (name) => {
		return name.split('_').map((value) => value.charAt(0).toUpperCase() + value.substr(1)).join(' ');
	};

	decideColumns = () => {
		return [
			{ name: 'icon', sort: false, filter: false },
			{ name: 'name', sort: true, filter: false },
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
		option.expandableRows = true;
		option.renderExpandableRow = (rowData, rowMeta) => {
			return <div>{1}</div>;
		};
		option.onRowsSelect = () => {};
		option.customToolbar = () => <div>123</div>;

		option.onCellClick = (colData, cellMeta) => {
			// console.log(colData);
			// console.log(cellMeta);
		};
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
				id: item._id,
				name: item.name,
				icon: getColoredIcons('Settings', item.icon.split('_')[0].toLowerCase()),
				created_at: moment(item.created_at).fromNow(),
				public: item.public,
				favourite: item.favourite
			};
		});
	};

	render() {
		const { decideColumns, transformData, transformOption, filterData } = this;
		const { options, data, genericTransformData } = this.props;
		return (
			<DataTable
				title={`Environment List`}
				data={transformData(genericTransformData(data, filterData))}
				columns={decideColumns()}
				options={transformOption(options)}
			/>
		);
	}
}

export default SelfEnvironments;
