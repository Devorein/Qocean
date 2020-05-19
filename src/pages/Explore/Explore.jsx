import React, { Component } from 'react';
import Board from '../../components/Board/Board';
import { withRouter } from 'react-router-dom';
import decideSections from '../../Utils/decideSections';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import axios from 'axios';
import pluralize from 'pluralize';
import './Explore.scss';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import SettingsIcon from '@material-ui/icons/Settings';
import HorizontalSplitIcon from '@material-ui/icons/HorizontalSplit';

class Explore extends Component {
	state = {
		data: []
	};

	refetchData = (type) => {
		axios
			.get(`http://localhost:5001/api/v1/${pluralize(type, 2)}`)
			.then(({ data }) => {
				this.setState({
					data
				});
			})
			.catch((err) => {
				console.log(err);
			});
	};

	render() {
		const switchPage = (page) => {
			history.push(`/${page}`);
		};

		const { history, match } = this.props;

		const headers = [
			{ name: 'user', link: 'explore/user', icon: <AccountCircleIcon /> },
			{ name: 'quiz', link: 'explore/quiz', icon: <HorizontalSplitIcon /> },
			{ name: 'question', link: 'explore/question', icon: <QuestionAnswerIcon /> },
			{ name: 'folder', link: 'explore/folder', icon: <FolderOpenIcon /> },
			{ name: 'environment', link: 'explore/environment', icon: <SettingsIcon /> }
		];
		const index = headers.findIndex(({ name }) => name === match.params.type);

		return (
			<div className="explore page">
				<Tabs
					value={index === -1 ? 0 : index}
					onChange={(e, value) => {
						switchPage(headers[value].link);
					}}
					indicatorColor="primary"
					textColor="primary"
					centered
				>
					{headers.map(({ name, icon }) => <Tab key={name} label={name} icon={icon} />)}
				</Tabs>
				{/* <Board
					headers={headers}
					page="explore"
					type={type}
					data={data}
					onHeaderClick={this.refetchData}
					sectionDecider={decideSections}
				/> */}
			</div>
		);
	}
}

export default withRouter(Explore);
