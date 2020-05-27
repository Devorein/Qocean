import React, { Component, Fragment } from 'react';
import DataTable from '../../components/DataTable/DataTable';
import moment from 'moment';
import getColoredIcons from '../../Utils/getColoredIcons';
import { AppContext } from '../../context/AppContext';
import SettingsIcon from '@material-ui/icons/Settings';
import shortid from 'shortid';
import axios from 'axios';

class SelfEnvironments extends Component {
	static contextType = AppContext;

	decideLabel = (name) => {
		return name.split('_').map((value) => value.charAt(0).toUpperCase() + value.substr(1)).join(' ');
	};

	decideColumns = () => {
		return [
			{ name: 'icon', sort: false, filter: false },
			{ name: 'name', sort: true, filter: false },
			{ name: 'public', sort: true, filter: true },
			{ name: 'favourite', sort: true, filter: true },
			{ name: 'created_at', sort: true, filter: false }
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

	transformOption = (options) => {
		return options;
	};

	filterData = (item) => {
		const exclude = [ '__v', 'user', '_id' ];
		const primary = [ 'name', 'public', 'favourite' ];

		return {
			exclude,
			primary
		};
	};

	setAsCurrent = (env) => {
		axios
			.post(
				`http://localhost:5001/api/v1/environments/setcurrent`,
				{
					env
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				}
			)
			.then((data) => {
				this.context.refetchUser().then(() => {
					this.props.refetchData();
				});
			});
	};

	transformData = (data) => {
		return data.map((item, index) => {
			const { children } = item.name.props;
			const active = this.context.user.current_environment._id === item._id;
			const elem = React.cloneElement(item.name, null, [
				children[0],
				children[1],
				<SettingsIcon
					style={{ fill: active ? '#ead50f' : '#ddd' }}
					onClick={this.setAsCurrent.bind(null, item._id)}
					key={shortid.generate()}
				/>,
				children[2]
			]);
			return {
				id: item._id,
				name: elem,
				icon: getColoredIcons('Settings', item.icon.split('_')[0].toLowerCase()),
				created_at: moment(item.created_at).fromNow(),
				public: item.public,
				favourite: item.favourite
			};
		});
	};

	render() {
		const { decideColumns, transformData, transformOption, filterData } = this;
		const { data, options, genericTransformData } = this.props;

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
