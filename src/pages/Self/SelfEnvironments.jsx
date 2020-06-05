import React, { Component } from 'react';
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
		return this.props.cols
			.concat([
				{ name: 'icon' },
				{ name: 'name' },
				{ name: 'public' },
				{ name: 'favourite' },
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
			const active = this.context.user.current_environment._id === item._id;

			return {
				...item,
				name: (
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<SettingsIcon
							style={{ fill: active ? '#ead50f' : '#ddd', marginRight: 3 }}
							onClick={this.setAsCurrent.bind(null, item._id)}
							key={shortid.generate()}
						/>
						{item.name}
					</div>
				),
				id: item._id,
				icon: getColoredIcons('Settings', item.icon.split('_')[0].toLowerCase()),
				created_at: moment(item.created_at).fromNow(),
				updated_at: moment(item.updated_at).fromNow()
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
