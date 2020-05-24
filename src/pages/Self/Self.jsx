import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import CustomTabs from '../../components/Tab/Tabs';
import axios from 'axios';
import pluralize from 'pluralize';
import SelfQuizzes from './SelfQuizzes';
import SelfQuestions from './SelfQuestions';
import SelfFolders from './SelfFolders';
import SelfEnvironments from './SelfEnvironments';
class Self extends Component {
	state = {
		data: [],
		type: null,
		rowsPerPage: 15,
		page: 0,
		totalCount: 0
	};

	refetchData = (type, queryParams) => {
		const queryString = queryParams
			? '?' +
				Object.keys(queryParams)
					.map((key) => key + '=' + (key === 'page' ? parseInt(queryParams[key]) + 1 : queryParams[key]))
					.join('&')
			: '';
		const headers = {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		};
		axios
			.get(`http://localhost:5001/api/v1/${pluralize(type, 2)}/countMine`, {
				...headers
			})
			.then(({ data: { data: totalCount } }) => {
				axios
					.get(`http://localhost:5001/api/v1/${pluralize(type, 2)}/me${queryString}`, {
						...headers
					})
					.then(({ data: { data } }) => {
						this.setState({
							data,
							type,
							totalCount,
							page: 0
						});
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
		const { page, rowsPerPage, totalCount } = this.state;
		const options = {
			filterType: 'checkbox',
			count: totalCount,
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

		let { type } = this.state;
		type = type.toLowerCase();
		if (type === 'quiz') return <SelfQuizzes {...props} />;
		else if (type === 'question') return <SelfQuestions {...props} />;
		else if (type === 'folder') return <SelfFolders {...props} />;
		else if (type === 'environment') return <SelfEnvironments {...props} />;
	};

	render() {
		const { data } = this.state;

		const { match: { params: { type } } } = this.props;

		const headers = [ 'Quiz', 'Question', 'Folder', 'Environment' ].map((header) => {
			return {
				name: header,
				link: `self/${header}`
			};
		});

		return (
			<div className="Self page">
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

export default withRouter(Self);
