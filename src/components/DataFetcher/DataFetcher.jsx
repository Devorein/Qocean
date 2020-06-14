import React, { Component } from 'react';
import axios from 'axios';
import pluralize from 'pluralize';
import qs from 'qs';

import populateQueryParams from '../../Utils/populateQueryParams';

class DataFetcher extends Component {
	state = {
		data: [],
		totalCount: 0
	};

	refetchData = (type, queryParams) => {
		const { page } = this.props;
		type = type.toLowerCase();
		populateQueryParams(type, queryParams, this.props.user);
		const queryString = qs.stringify(queryParams, { depth: 10 });
		const headers = {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		};
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
							totalCount
						});
					});
			})
			.catch((err) => {
				console.log(err);
			});
	};

	render() {
		const { data, totalCount } = this.state;
		return this.props.children({
			data,
			totalCount,
			refetchData: this.refetchData
		});
	}
}

export default DataFetcher;
