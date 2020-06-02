import React, { Component } from 'react';
import DataTable from '../../components/DataTable/DataTable';
import getColoredIcons from '../../Utils/getColoredIcons';
import moment from 'moment';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { withTheme } from '@material-ui/core';
class ExploreFolders extends Component {
	decideLabel = (name) => {
		return name.split('_').map((value) => value.charAt(0).toUpperCase() + value.substr(1)).join(' ');
	};

	decideColums = () => {
		return this.props.cols.concat(
			[
				{ name: 'icon', sort: false, filter: false },
				{ name: 'name', sort: true, filter: false },
				{ name: 'total_quizzes', sort: true, filter: true },
				{ name: 'total_questions', sort: true, filter: true },
				{ name: 'creator', sort: true, filter: false },
				{ name: 'watchers', sort: true, filter: false },
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
		const { theme: { palette: { error, success } } } = this.props;

		return data.map((item, index) => {
			return {
				...item,
				action: (
					<div style={{ display: 'flex' }}>
						{item.action}
						{this.props.user ? item.watchers.includes(this.props.user._id) ? (
							<VisibilityIcon
								style={{ fill: success.main }}
								onClick={this.props.watchToggle.bind(null, 'folders', item._id)}
							/>
						) : (
							<VisibilityOffIcon
								style={{ fill: error.main }}
								onClick={this.props.watchToggle.bind(null, 'folders', item._id)}
							/>
						) : null}
					</div>
				),
				creator: item.user.username,
				icon: getColoredIcons('Folder', item.icon.split('_')[0].toLowerCase()),
				watchers: item.watchers.length,
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
					title={`Folder List`}
					data={transformData(data)}
					columns={decideColums()}
					options={transformOption(options)}
				/>
			</div>
		);
	}
}

export default withTheme(ExploreFolders);
