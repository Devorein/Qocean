import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import getColoredIcons from '../../Utils/getColoredIcons';

import axios from 'axios';
import pluralize from 'pluralize';
import './Explore.scss';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import SettingsIcon from '@material-ui/icons/Settings';
import HorizontalSplitIcon from '@material-ui/icons/HorizontalSplit';
import MUIDataTable from 'mui-datatables';

class Explore extends Component {
	state = {
		data: [],
		columns: [],
		type: null
	};

	refetchData = (type) => {
		axios
			.get(`http://localhost:5001/api/v1/${pluralize(type, 2)}`)
			.then(({ data: { data } }) => {
				const columns = this.decideColums(type);
				this.setState({
					data: this.transformData(data, type),
					type,
					columns
				});
			})
			.catch((err) => {
				console.log(err);
			});
	};

	transformData = (data, type) => {
		if (type === 'folder') {
			return data.map((item, index) => {
				return {
					...item,
					username: item.user.username,
					icon: getColoredIcons('Folder', item.icon.split('_')[0].toLowerCase())
				};
			});
		}
	};
	decideLabel = (name) => {
		return name.split('_').map((value) => value.charAt(0).toUpperCase() + value.substr(1)).join(' ');
	};

	decideColums = (type) => {
		if (type === 'folder')
			return [ 'icon', 'created_at', 'name', 'total_quizzes', 'total_questions', 'username' ].map((name) => {
				return {
					name,
					label: this.decideLabel(name),
					filter: true,
					sort: true
				};
			});
		else return [];
	};

	render() {
		const switchPage = (page) => {
			history.push(`/${page.link}`);
			this.refetchData(page.name);
		};
		const { columns, data, type } = this.state;

		const { history, match } = this.props;

		const headers = [
			{ name: 'user', link: 'explore/user', icon: <AccountCircleIcon /> },
			{ name: 'quiz', link: 'explore/quiz', icon: <HorizontalSplitIcon /> },
			{ name: 'question', link: 'explore/question', icon: <QuestionAnswerIcon /> },
			{ name: 'folder', link: 'explore/folder', icon: <FolderOpenIcon /> },
			{ name: 'environment', link: 'explore/environment', icon: <SettingsIcon /> }
		];
		const index = headers.findIndex(({ name }) => name === match.params.type);
		const options = {
			filterType: 'dropdown',
			total: data.length,
			page: 2,
			customToolbar() {
				return <div>Custom Toolbar</div>;
			},
			responsive: 'scrollMaxHeight',
			rowsPerPageOptions: [ 10, 15, 20, 30, 50 ],
			print: false,
			download: false
		};
		return (
			<div className="explore page">
				<Tabs
					value={index === -1 ? 0 : index}
					onChange={(e, value) => {
						switchPage(headers[value]);
					}}
					indicatorColor="primary"
					textColor="primary"
					centered
				>
					{headers.map(({ name, icon }) => <Tab key={name} label={name} icon={icon} />)}
				</Tabs>
				<MUIDataTable title={`${type} List`} data={data} columns={columns} options={options} />
			</div>
		);
	}
}

export default withRouter(Explore);
