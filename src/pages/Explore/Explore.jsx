import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import pluralize from 'pluralize';
import './Explore.scss';
import CustomTabs from '../../components/Tab/Tabs';
import ExploreUsers from './ExploreUsers';
import ExploreQuizzes from './ExploreQuizzes';
import ExploreQuestions from './ExploreQuestions';
import ExploreFolders from './ExploreFolders';
import ExploreEnvironments from './ExploreEnvironments';
class Explore extends Component {
	state = {
		data: [],
		type: null,
		rowsPerPage: 15,
		page: 0
	};

	refetchData = (type, queryParams) => {
		const queryString = queryParams
			? '?' +
				Object.keys(queryParams)
					.map((key) => key + '=' + (key === 'page' ? parseInt(queryParams[key]) + 1 : queryParams[key]))
					.join('&')
			: '';
		axios
			.get(`http://localhost:5001/api/v1/${pluralize(type, 2)}${queryString}`)
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
		this.refetchData(page.name, {
			limit: 15
		});
	};

	decideTable = () => {
		const { page, rowsPerPage } = this.state;
		const options = {
			filterType: 'checkbox',
			count: 50,
			page,
			customToolbar() {
				return <div>Custom Toolbar</div>;
			},
			rowsPerPage: this.props.user ? this.props.user.current_environment.default_explore_rpp : 15,
			responsive: 'scrollMaxHeight',
			rowsPerPageOptions: [ 10, 15, 20, 30, 40, 50 ],
			print: false,
			download: false,
			onCellClick(colData, { colIndex }) {
				if (colIndex === 5) console.log(colData);
			},
			onRowsDelete() {
				return false;
			},
			serverSide: true,
			onChangePage: (page) => {
				this.setState(
					{
						page
					},
					() => {
						this.refetchData(this.state.type, {
							limit: rowsPerPage,
							page
						});
					}
				);
			},
			onChangeRowsPerPage: (rowsPerPage) => {
				this.setState(
					{
						rowsPerPage
					},
					() => {
						this.refetchData(this.state.type, {
							limit: rowsPerPage,
							page
						});
					}
				);
			}
		};

		const props = {
			data: this.state.data,
			options,
			page
		};

		const { type } = this.state;
		if (type === 'user') return <ExploreUsers {...props} />;
		else if (type === 'quiz') return <ExploreQuizzes {...props} />;
		else if (type === 'question') return <ExploreQuestions {...props} />;
		else if (type === 'folder') return <ExploreFolders {...props} />;
		else if (type === 'environment') return <ExploreEnvironments {...props} />;
	};

	render() {
		const { data } = this.state;

		const { match: { params: { type } } } = this.props;

		const headers = [ 'user', 'quiz', 'question', 'folder', 'environment' ].map((header) => {
			return {
				name: header,
				link: `explore/${header}`
			};
		});

		return (
			<div className="explore page">
				<CustomTabs
					against={type}
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
