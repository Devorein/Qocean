import React, { Component } from 'react';
import qs from 'qs';
import axios from 'axios';
import pluralize from 'pluralize';
import { withStyles } from '@material-ui/core/styles';

import StackComps from '../../Stack/StackComps';
import { AppContext } from '../../../context/AppContext';
import DataTransformer from '../../DataTransformer/DataTransformer';
import DataDisplayer from '../../Visualizations/DataDisplayer/DataDisplayer';

import sectorizeData from '../../../Utils/sectorizeData';

import './Detailer.scss';

class Detailer extends Component {
	static contextType = AppContext;

	state = {
		type: null,
		data: null
	};

	fetchData = (type, id) => {
		const page = this.props.page.toLowerCase();
		let queryParams = {};
		type = type.toLowerCase();
		if (type === 'watchers') type = 'users';
		else if (type === 'current_environments') type = 'environments';
		// populateQueryParams(type, queryParams, this.context.user);
		if (!type.match(/(user|users)/)) queryParams._id = id;
		if (page !== 'self') queryParams._id = id;
		const queryString = qs.stringify(queryParams);
		const url = `http://localhost:5001/api/v1/${pluralize.isPlural(type) ? type : pluralize(type, 2)}${page === 'self'
			? '/me'
			: ''}?${queryString}`;
		axios
			.get(url, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			})
			.then(({ data: { data } }) => {
				this.addToStack(url);
				this.setState({
					data,
					type
				});
			});
	};

	refetchData = (currentIndex) => {
		const url = this.StackState.stack[currentIndex];
		const [ uri ] = url.split('?');
		const chunks = uri.split('/');
		let type = chunks[chunks.length - 1];
		if (type === 'me') type = chunks[chunks.length - 2];
		axios
			.get(url, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			})
			.then(({ data: { data } }) => {
				this.setState(
					{
						data,
						type
					},
					() => {
						this.changeCurrentIndex(currentIndex);
					}
				);
			});
	};

	renderDetailer = () => {
		const { page, detailerLocation } = this.props;
		const { type } = this.state;
		const sectorizedData = this.manipulatedData
			? sectorizeData(this.manipulatedData, type, {
					authenticated: this.context.user,
					purpose: 'detail',
					page
				})
			: null;

		if (sectorizedData) {
			return (
				<div
					className={`Detailer ${this.props.classes.Detailer}`}
					style={{ order: detailerLocation.view === 'left' ? 0 : 1 }}
				>
					<div className="Detailer_stats">{this.StackComps.map((StackComp) => StackComp)}</div>
					<DataDisplayer
						targetComp="Detailer"
						className="Detailer_Content"
						data={[ sectorizedData ]}
						page={this.props.page}
						type={this.props.type}
						view=""
						onRefClick={this.fetchData}
					/>
				</div>
			);
		}
	};

	render() {
		const { data } = this.state;
		return (
			<StackComps refetchData={this.refetchData}>
				{(props) => {
					Object.keys(props).forEach((key) => (this[key] = props[key]));
					const { renderDetailer, fetchData, props: { children } } = this;
					return (
						<DataTransformer data={data} page={this.props.page} type={this.props.type} targetComp={'detailer'}>
							{({ manipulatedData }) => {
								this.manipulatedData = manipulatedData;
								return children({
									fetchData,
									Detailer: renderDetailer()
								});
							}}
						</DataTransformer>
					);
				}}
			</StackComps>
		);
	}
}

export default withStyles((theme) => ({
	Detailer: {
		backgroundColor: theme.darken(theme.palette.background.dark, 0.15),
		'& .Detailer_Item_Sector-tertiary': {
			backgroundColor: theme.lighten(theme.palette.background.dark, 0.25)
		},
		'& .Detailer_Item_Sector-tertiary_Item_value': {
			backgroundColor: theme.palette.background.light
		},
		'& .Detailer_Item_Sector-refs_Item_value': {
			backgroundColor: theme.lighten(theme.palette.background.dark, 0.25)
		}
	}
}))(Detailer);
