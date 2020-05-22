import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import pluralize from 'pluralize';
import './Explore.scss';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import SettingsIcon from '@material-ui/icons/Settings';
import HorizontalSplitIcon from '@material-ui/icons/HorizontalSplit';
import CustomTabs from '../../components/Tab/Tabs';
import ExploreUsers from './ExploreUsers';
import ExploreQuizzes from './ExploreQuizzes';
import ExploreQuestions from './ExploreQuestions';
import ExploreFolders from './ExploreFolders';
import ExploreEnvironments from './ExploreEnvironments';

class Explore extends Component {
	state = {
		data: [],
		type: null
	};

	refetchData = (type) => {
		axios
			.get(`http://localhost:5001/api/v1/${pluralize(type, 2)}`)
			.then(({ data: { data } }) => {
				this.setState({
					data,
					type
				});
			})
			.catch((err) => {
				console.log(err);
			});
	};

	switchPage = (page) => {
		this.props.history.push(`/${page.link}`);
		this.refetchData(page.name);
	};

	decideTable = () => {
		const options = {
			filterType: 'checkbox',
			total: this.state.data.length,
			page: 1,
			customToolbar() {
				return <div>Custom Toolbar</div>;
			},
			responsive: 'scrollMaxHeight',
			rowsPerPageOptions: [ 10, 15, 20, 30, 50 ],
			print: false,
			download: false,
			onCellClick(colData, { colIndex }) {
				if (colIndex === 5) console.log(colData);
			}
		};
		const { type } = this.state;
		if (type === 'user') return <ExploreUsers data={this.state.data} options={options} />;
		else if (type === 'quiz') return <ExploreQuizzes data={this.state.data} options={options} />;
		else if (type === 'question') return <ExploreQuestions data={this.state.data} options={options} />;
		else if (type === 'folder') return <ExploreFolders data={this.state.data} options={options} />;
		else if (type === 'environment') return <ExploreEnvironments data={this.state.data} options={options} />;
	};

	render() {
		const { data } = this.state;

		const { match } = this.props;

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
				<CustomTabs
					value={index === -1 ? 0 : index}
					onChange={(e, value) => {
						this.switchPage(headers[value]);
					}}
					height={50}
					headers={headers}
				/>
				{data.length > 0 ? this.decideTable() : <div>Loading data</div>}
			</div>
		);
	}
}

export default withRouter(Explore);
