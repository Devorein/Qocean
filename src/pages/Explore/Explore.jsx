import React, { Component } from 'react';
import axios from 'axios';
import pluralize from 'pluralize';
import qs from 'qs';

import Explorer from '../../components/Explorer/Explorer';
import populateQueryParams from '../../Utils/populateQueryParams';
import PageSwitcher from '../../components/PageSwitcher/PageSwitcher';

import './Explore.scss';

class Explore extends Component {
	state = {
		data: [],
		totaCount: 0
	};

	refetchData = (type, queryParams) => {
		type = type.toLowerCase();
		populateQueryParams(type, queryParams, this.props.user);
		const queryString = qs.stringify(queryParams, { depth: 10 });

		const headers = {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		};
		const [ count, endpoint, header ] = this.props.user
			? [ `countOthers`, '/others/', headers ]
			: [ 'countAll', '/', {} ];
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
		/* else {
			type = pluralize(type.split('_')[1], 2);
			axios
				.get(`http://localhost:5001/api/v1/watchlist/${type}/count`, { ...headers })
				.then(({ data: { data: totalCount } }) => {
					axios
						.get(`http://localhost:5001/api/v1/watchlist/${type}${queryString}`, { ...headers })
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
		} */
	};

	/* 	genericTransformData = (data) => {
		return data.map((item, index) => {
			return {
				...item,
				actions: (
					<div stlye={{ display: 'flex' }}>
						<NoteAddIcon
							onClick={(e) => {
								this.setState({
									isOpen: true,
									selectedIndex: index
								});
							}}
						/>
						<GetAppIcon
							onClick={(e) => {
								download(`${Date.now()}_${shortid.generate()}.json`, JSON.stringify(this.transformData([ item ])));
							}}
						/>
					</div>
				)
			};
		});
	}; */
	/* 
	watchToggle = (type, _id, e) => {
		e.persist();
		axios
			.put(
				`http://localhost:5001/api/v1/${type}/_/watch${type.charAt(0).toUpperCase() + type.substr(1)}`,
				{
					[type]: _id
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				}
			)
			.then(({ data: { data } }) => {
				this.context.changeResponse('Success', `Successfully toggled watch for ${data} ${type}`, 'success');
				this.refetchData();
			});
	}; */

	/* 	decideTable = () => {
    <VisibilityIcon
      onClick={this.watchToggle.bind(
        null,
        pluralize(this.state.type, 2).toLowerCase(),
        selectedRows.data.map(({ index }) => this.state.data[index]._id)
      )}
    />

    <VisibilityIcon
        onClick={this.watchToggle.bind(
          null,
          pluralize(this.state.type, 2).toLowerCase(),
          this.state.data.map((data) => data._id)
        )}
      />
		};
	}; */

	render() {
		const { refetchData } = this;
		const { data, totalCount = 0 } = this.state;

		return (
			<PageSwitcher
				page="explore"
				runAfterSwitch={(type) => {
					refetchData(type, { page: 1, limit: this.props.user.current_environment.default_self_rpp });
				}}
			>
				{({ CustomTabs, type }) => (
					<div className="Explore page">
						{CustomTabs}
						<Explorer
							page={'Explore'}
							data={data}
							totalCount={totalCount}
							type={type}
							refetchData={refetchData.bind(null, type)}
						/>
					</div>
				)}
			</PageSwitcher>
		);
	}
}

export default Explore;
