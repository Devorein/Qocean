import React from 'react';
import axios from 'axios';
import pluralize from 'pluralize';
import qs from 'qs';
import { AppContext } from '../../context/AppContext';
import populateQueryParams from '../../Utils/populateQueryParams';

class DataFetcher extends React.Component {
	static contextType = AppContext;
	state = {
		data: [],
		totalCount: 0,
		type: (() => {
			const prop = `default_${this.props.page.toLowerCase()}_landing`;
			return this.context.user && this.context.user.current_environment[prop]
				? this.context.user.current_environment[prop]
				: 'Quiz';
		})()
	};

	refetchData = (type, queryParams) => {
		const page = this.props.page.toLowerCase();
		type = type.toLowerCase();
		populateQueryParams(type, queryParams, this.context.user, page);
		const queryString = qs.stringify(queryParams, { depth: 10 });
		const headers = {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		};

		if (page.match(/(self|play)/)) {
			axios
				.get(`http://localhost:5001/api/v1/${pluralize(type, 2)}/countMine?${queryString}`, {
					...headers
				})
				.then(({ data: { data: totalCount } }) => {
					axios
						.get(`http://localhost:5001/api/v1/${pluralize(type, 2)}/me?${queryString}`, {
							...headers
						})
						.then(({ data: { data } }) => {
							this.setState({
								data,
								totalCount,
								type
							});
						});
				})
				.catch((err) => {
					console.log(err);
				});
		} else if (page === 'explore') {
			const [ count, endpoint, header ] = this.context.user
				? [ `countOthers`, '/others/', headers ]
				: [ 'countAll', '/', {} ];
			if (type === 'question') {
				axios
					.post(`http://localhost:5001/api/v1/questions/others`, queryParams, {
						headers: {
							Authorization: `Bearer ${localStorage.getItem('token')}`
						}
					})
					.then(({ data: { data, count } }) => {
						this.setState({
							data,
							totalCount: count,
							type
						});
					});
			} else {
				axios
					.get(`http://localhost:5001/api/v1/${pluralize(type, 2)}/${count}?${queryString}`, { ...header })
					.then(({ data: { data: totalCount } }) => {
						axios
							.get(`http://localhost:5001/api/v1/${pluralize(type, 2)}${endpoint}?${queryString}`, { ...header })
							.then(({ data: { data } }) => {
								this.setState({
									data,
									totalCount
								});
							});
					})
					.catch((err) => {
						console.log(err);
					});
			}
		} else if (page === 'watchlist') {
			axios
				.get(`http://localhost:5001/api/v1/watchlist/${pluralize(type, 2)}/count?${queryString}`, { ...headers })
				.then(({ data: { data: totalCount } }) => {
					axios
						.get(`http://localhost:5001/api/v1/watchlist/${pluralize(type, 2)}?${queryString}`, { ...headers })
						.then(({ data: { data } }) => {
							this.setState({
								data,
								totalCount
							});
						});
				})
				.catch((err) => {
					console.log(err);
				});
		}
	};

	render() {
		const { data, totalCount, type } = this.state;
		return this.props.children({
			data,
			totalCount,
			refetchData: this.refetchData,
			updateDataLocally: (data) => {
				this.setState({ data });
			},
			type
		});
	}
}

export default DataFetcher;