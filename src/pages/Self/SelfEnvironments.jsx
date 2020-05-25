import React, { Component } from 'react';
import DataTable from '../../components/DataTable/DataTable';
import moment from 'moment';
import getColoredIcons from '../../Utils/getColoredIcons';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';
import { withSnackbar } from 'notistack';
import deleteResource from '../../operations/deleteResource';
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

	deleteResource = (selectedRows) => {
		const { enqueueSnackbar, refetchData } = this.props;
		let current = 0;
		let done = false;
		function reductiveDownloadChain(items) {
			return items.reduce((chain, currentItem) => {
				return chain.then((_) => {
					current++;
					const { _id, name } = currentItem;
					deleteResource('environment', _id).then(({ data }) => {
						enqueueSnackbar(`Environment ${name} has been deleted`, {
							variant: 'success'
						});
						if (current === selectedRows.length && !done) {
							refetchData();
							done = true;
						}
					});
				});
			}, Promise.resolve());
		}
		selectedRows = selectedRows.data.map(({ index }) => this.props.data[index]);
		reductiveDownloadChain(selectedRows);
	};

	transformOption = (option) => {
		const { deleteResource } = this;
		option.expandableRows = true;
		option.renderExpandableRow = (rowData, rowMeta) => {
			return <div>{1}</div>;
		};
		option.onRowsSelect = () => {};
		option.customToolbar = () => <div>123</div>;
		option.customToolbarSelect = (selectedRows, displayData, setSelectedRows) => {
			return (
				<div>
					<DeleteIcon onClick={deleteResource.bind(null, selectedRows)} />
				</div>
			);
		};
		option.onCellClick = (colData, cellMeta) => {
			console.log(colData);
			console.log(cellMeta);
		};
		option.onTableInit = (action, tableState) => {};
		return option;
	};

	transformData = (data) => {
		return data.map((item, index) => {
			return {
				id: item._id,
				name: item.name,
				icon: getColoredIcons('Settings', item.icon.split('_')[0].toLowerCase()),
				created_at: moment(item.created_at).fromNow(),
				public: item.public.toString(),
				favourite: item.favourite.toString()
			};
		});
	};

	render() {
		const { decideColumns, transformData, transformOption } = this;
		const { options, data } = this.props;
		return (
			<div>
				<DataTable
					title={`Environment List`}
					data={transformData(data)}
					columns={decideColumns()}
					options={transformOption(options)}
				/>
			</div>
		);
	}
}

export default withSnackbar(SelfEnvironments);
