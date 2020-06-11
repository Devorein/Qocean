import React, { Component } from 'react';
import axios from 'axios';
import pluralize from 'pluralize';
import qs from 'qs';

import Explorer from '../../components/Explorer/Explorer';
import populateQueryParams from '../../Utils/populateQueryParams';
import PageSwitcher from '../../components/PageSwitcher/PageSwitcher';

class Watchlist extends Component {
	state = {
		data: [],
		totaCount: 0
	};

	refetchData = (type, queryParams) => {
		type = pluralize(type.toLowerCase(), 2);
		populateQueryParams(type, queryParams, this.props.user);
		const queryString = qs.stringify(queryParams, { depth: 10 });

		const headers = {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		};
		axios
			.get(`http://localhost:5001/api/v1/watchlist/${type}/count?${queryString}`, { ...headers })
			.then(({ data: { data: totalCount } }) => {
				axios
					.get(`http://localhost:5001/api/v1/watchlist/${type}?${queryString}`, { ...headers })
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
		const { refetchData } = this;
		const { data, totalCount = 0 } = this.state;
		return (
			<PageSwitcher
				page="watchlist"
				runAfterSwitch={(type) => {
					refetchData(type, { page: 1, limit: this.props.user.current_environment.default_watchlist_rpp });
				}}
			>
				{({ CustomTabs, type }) => (
					<div className="Explore page">
						{CustomTabs}
						<Explorer
							page={'Watchlist'}
							data={data}
							totalCount={totalCount}
							type={type}
							refetchData={refetchData.bind(null, type)}
							updateDataLocally={(data) => {
								this.setState({ data });
							}}
						/>
					</div>
				)}
			</PageSwitcher>
		);
	}
}

export default Watchlist;
