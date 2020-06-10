import React, { Component } from 'react';
import axios from 'axios';
import pluralize from 'pluralize';
import Explorer from '../../components/Explorer/Explorer';
import populateQueryParams from '../../Utils/populateQueryParams';
import PageSwitcher from '../../components/PageSwitcher/PageSwitcher';
import qs from 'qs';

import './Self.scss';

class Self extends Component {
	state = {
		data: [],
		type: this.props.user.current_environment.default_self_landing,
		totalCount: 0
	};

	refetchData = (type, queryParams) => {
		type = type ? type.toLowerCase() : this.state.type.toLowerCase();
		populateQueryParams(type, queryParams, this.props.user);
		const queryString = qs.stringify(queryParams);
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
							type,
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
		const { data, totalCount } = this.state;

		return (
			<PageSwitcher
				page="self"
				runAfterSwitch={(type) => {
					this.refetchData(type, { page: 1, limit: this.props.user.current_environment.default_self_rpp });
				}}
			>
				{({ CustomTabs, type }) => (
					<div className="Self page">
						{CustomTabs}
						<Explorer page={'Self'} data={data} totalCount={totalCount} type={type} refetchData={refetchData} />
					</div>
				)}
			</PageSwitcher>
		);
	}
}

export default Self;
