import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import pluralize from 'pluralize';
import CustomTabs from '../../components/Tab/Tabs';
import { AppContext } from '../../context/AppContext';
import shortid from 'shortid';

class Watchlist extends Component {
	static contextType = AppContext;

	state = {
		data: [],
		type: this.props.user ? this.props.user.current_environment.default_explore_landing.toLowerCase() : 'user',
		rowsPerPage: this.props.user ? this.props.user.current_environment.default_explore_rpp : 15,
		totaCount: 0,
		page: 0,
		sortCol: null,
		sortOrder: null
	};

	componentDidMount() {
		this.refetchData(this.state.type, {
			limit: this.state.rowsPerPage,
			page: this.state.page
		});
	}

	refetchData = (type, queryParams, newState = {}) => {
		type = type ? type : this.state.type;

		queryParams = queryParams
			? queryParams
			: {
					limit: this.state.rowsPerPage,
					page: this.state.page
				};
		if (this.state.sortCol && Object.keys(newState).length === 0)
			queryParams.sort = (this.state.sortOrder === 'desc' ? '-' : '') + this.state.sortCol;
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

		// axios
		// 	.get(`http://localhost:5001/api/v1/${pluralize(type, 2)}/${count}`, { ...headers })
		// 	.then(({ data: { data: totalCount } }) => {
		// 		axios
		// 			.get(`http://localhost:5001/api/v1/${pluralize(type, 2)}${endpoint}${queryString}`, { ...header })
		// 			.then(({ data: { data } }) => {
		// 				this.setState({
		// 					data,
		// 					totalCount,
		// 					...newState
		// 				});
		// 			});
		// 	})
		// 	.catch((err) => {
		// 		console.log(err);
		// 	});
	};

	switchPage = (page) => {
		this.props.history.push(`/${page.link}`);
		this.refetchData(page.name, null, {
			type: page.name,
			page: 0,
			sortCol: null,
			sortOrder: null
		});
	};

	render() {
		const { data } = this.state;
		const { match: { params: { type } } } = this.props;
		const headers = [ 'quiz', 'folder' ].map((header) => {
			return {
				name: header,
				link: `watchlist/${header}`
			};
		});

		return (
			<div className="watchlist page">
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

export default withRouter(Watchlist);
