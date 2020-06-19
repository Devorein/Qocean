import React, { Component } from 'react';
import moment from 'moment';
import qs from 'qs';
import axios from 'axios';
import pluralize from 'pluralize';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import PublicIcon from '@material-ui/icons/Public';
import { withStyles } from '@material-ui/core/styles';

import StackComps from '../../Stack/StackComps';
import { AppContext } from '../../../context/AppContext';
import sectorizeData from '../../../Utils/sectorizeData';
import populateQueryParams from '../../../Utils/populateQueryParams';
import getColoredIcons from '../../../Utils/getColoredIcons';
import ChipContainer from '../../../components/Chip/ChipContainer';

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
		populateQueryParams(type, queryParams, this.context.user);
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

	renderRefs = (data, ref, sector) => {
		const renderRefItems = (item) => {
			const name = item.username || item.name;
			return (
				<div
					className={`Detailer_container-${sector}_item_value_container_item Detailer_container-${sector}_item-${ref}_value_container_item`}
					key={item._id}
					onClick={(e) => {
						this.fetchData(ref, item._id);
					}}
				>
					{name}
				</div>
			);
		};
		const className = `Detailer_container-${sector}_item_value_container Detailer_container-${sector}_item-${ref}_value_container`;
		if (data) {
			if (data.length === 0) return <div className={className}>N/A</div>;
			else
				return (
					<div className={className}>
						{Array.isArray(data) ? data.map((item) => renderRefItems(item)) : renderRefItems(data)}
					</div>
				);
		}
	};

	renderValue = (key, value) => {
		const page = this.props.page.toLowerCase();
		if (key.match(/^(created_at|updated_at|joined_at)$/)) value = moment(value).fromNow();
		else if (key.match(/(tags)/)) value = <ChipContainer chips={value} type={'regular'} height={50} />;
		else if (key === 'icon') value = getColoredIcons(this.state.type, value);
		else if (key === 'image') {
			let src = null;
			const isLink = value ? value.match(/^(http|data)/) : `http://localhost:5001/uploads/none.png`;
			if (isLink) src = value;
			else src = `http://localhost:5001/uploads/${value}`;
			value = <img src={src} alt={`${this.state.type}`} />;
		} else if (value !== null) value = value.toString();

		if (page === 'self') {
			if (key === 'public')
				value = <PublicIcon style={{ fill: value.toString() === 'true' ? '#00a3e6' : '#f4423c' }} />;
			else if (key === 'favourite')
				value =
					value.toString() === 'true' ? (
						<StarIcon style={{ fill: '#f0e744' }} />
					) : (
						<StarBorderIcon style={{ fill: '#ead50f' }} />
					);
		}
		return value;
	};

	renderDetailer = (StackComps) => {
		const { page, detailerLocation } = this.props;
		const { data, type } = this.state;
		const sectorizedData = data
			? sectorizeData(data, type, {
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
					<div className="Detailer_stats">{StackComps.map((StackComp) => StackComp)}</div>
					<div className="Detailer_content">
						{[ 'primary', 'secondary', 'tertiary' ].map((sector) => (
							<div className={`Detailer_container Detailer_container-${sector}`} key={sector}>
								{Object.entries(sectorizedData[sector]).map(([ key, value ]) => (
									<div
										className={`Detailer_container_item Detailer_container-${sector}_item Detailer_container_item-${key}`}
										key={key}
									>
										<span className={`Detailer_container_item_key Detailer_container-${sector}_item_key`}>
											{key.split('_').map((c) => c.charAt(0).toUpperCase() + c.substr(1)).join(' ')}
										</span>
										<span className={`Detailer_container_item_value Detailer_container-${sector}_item_value`}>
											{this.renderValue(key, value)}
										</span>
									</div>
								))}
							</div>
						))}
						{[ 'ref', 'refs' ].map((sector) => (
							<div className={`Detailer_container Detailer_container-${sector}`} key={sector}>
								{Object.keys(sectorizedData[sector]).map((ref) => {
									return (
										<div key={ref} className={`Detailer_container-${sector}_item Detailer_container_item`}>
											<div
												className={`Detailer_container-${sector}_item_key Detailer_container-${sector}_item-${ref}_key`}
											>
												{ref.split('_').map((c) => c.charAt(0).toUpperCase() + c.substr(1)).join(' ')}
												{sector === 'refs' ? (
													<div
														className={`Detailer_container-${sector}_item_key_count Detailer_container-${sector}_item-${ref}_key_count`}
													>
														{sectorizedData[sector][ref].length}
													</div>
												) : null}
											</div>
											{this.renderRefs(sectorizedData[sector][ref], ref, sector)}
										</div>
									);
								})}
							</div>
						))}
					</div>
				</div>
			);
		}
	};

	render() {
		return (
			<StackComps refetchData={this.refetchData}>
				{(props) => {
					Object.keys(props).forEach((key) => (this[key] = props[key]));
					const { renderDetailer, fetchData, props: { children } } = this;
					return children({
						fetchData,
						Detailer: renderDetailer(props.StackComps)
					});
				}}
			</StackComps>
		);
	}
}

export default withStyles((theme) => ({
	Detailer: {
		backgroundColor: theme.darken(theme.palette.background.dark, 0.15),
		'& .Detailer_container-tertiary': {
			backgroundColor: theme.lighten(theme.palette.background.dark, 0.5)
		},
		'& .Detailer_container-tertiary_item_value': {
			backgroundColor: theme.palette.background.light
		},
		'& .Detailer_container-refs_item_value_container_item': {
			backgroundColor: theme.lighten(theme.palette.background.dark, 0.5)
		}
	}
}))(Detailer);
