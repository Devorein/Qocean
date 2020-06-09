import React, { Component } from 'react';
import moment from 'moment';
import { AppContext } from '../../../context/AppContext';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import PublicIcon from '@material-ui/icons/Public';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import pluralize from 'pluralize';
import qs from 'qs';
import Color from 'color';
import convert from 'color-convert';
import sectorizeData from '../../../Utils/sectorizeData';
import populateQueryParams from '../../../Utils/populateQueryParams';
import getColoredIcons from '../../../Utils/getColoredIcons';
import ChipContainer from '../../../components/Chip/ChipContainer';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import TextInput from '../../Input/TextInput/TextInput';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
import FileCopyIcon from '@material-ui/icons/FileCopy';

import './Detailer.scss';
const headers = {
	headers: {
		Authorization: `Bearer ${localStorage.getItem('token')}`
	}
};
class Detailer extends Component {
	static contextType = AppContext;

	state = {
		stack: [],
		type: null,
		data: null,
		currentIndex: null
	};

	fetchData = (type, id) => {
		let queryParams = {};
		type = type.toLowerCase();
		if (type === 'watchers') type = 'users';
		else if (type === 'current_environments') type = 'environments';
		populateQueryParams(type, queryParams, this.context.user);
		if (!type.match(/(user|users)/)) queryParams._id = id;
		const queryString = qs.stringify(queryParams);
		const url = `http://localhost:5001/api/v1/${pluralize.isPlural(type) ? type : pluralize(type, 2)}${this.context.user
			? '/me'
			: ''}?${queryString}`;
		axios
			.get(url, {
				...headers
			})
			.then(({ data: { data } }) => {
				this.state.stack.push(url);
				this.setState({
					data,
					stack: this.state.stack,
					type,
					currentIndex: this.state.currentIndex === null ? 0 : this.state.currentIndex + 1
				});
			});
	};

	refetchData = (currentIndex) => {
		const { stack } = this.state;
		const url = stack[currentIndex];
		const [ uri ] = url.split('?');
		const chunks = uri.split('/');
		let type = chunks[chunks.length - 1];
		if (type === 'me') type = chunks[chunks.length - 2];
		axios
			.get(url, {
				...headers
			})
			.then(({ data: { data } }) => {
				this.setState({
					data,
					currentIndex,
					type
				});
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
		if (key.match(/^(created_at|updated_at|joined_at)$/)) value = moment(value).fromNow();
		else if (key.match(/(tags)/)) value = <ChipContainer chips={value} type={'regular'} height={50} />;
		else if (key === 'public') value = <PublicIcon style={{ fill: value ? '#00a3e6' : '#f4423c' }} />;
		else if (key === 'favourite')
			value = value ? <StarIcon style={{ fill: '#f0e744' }} /> : <StarBorderIcon style={{ fill: '#ead50f' }} />;
		else if (key === 'icon') value = getColoredIcons(this.state.type, value);
		else if (key === 'image') {
			let src = null;
			const isLink = value ? value.match(/^(http|data)/) : `http://localhost:5001/uploads/none.png`;
			if (isLink) src = value;
			else src = `http://localhost:5001/uploads/${value}`;
			value = <img src={src} alt={`${this.state.type}`} />;
		} else if (value !== null) value = value.toString();
		return value;
	};

	alterHistory = (dir) => {
		let { stack, currentIndex } = this.state;
		if (dir === 'left') {
			stack.splice(0, stack.length - currentIndex);
			currentIndex = 0;
		} else if (dir === 'right') stack.splice(currentIndex + 1, stack.length - currentIndex);
		this.setState({
			stack,
			currentIndex
		});
	};

	renderDetailerStats = () => {
		const { stack, currentIndex } = this.state;
		return (
			<div className="Detailer_stats">
				<ChevronLeftIcon
					className="Detailer_stats_left"
					onClick={(e) => {
						if (currentIndex !== 0) this.refetchData(currentIndex - 1);
					}}
				/>
				<ChevronRightIcon
					className="Detailer_stats_right"
					onClick={(e) => {
						if (currentIndex !== stack.length - 1) this.refetchData(currentIndex + 1);
					}}
				/>
				<TextInput
					className="Detailer_stats_goto"
					fullWidth={false}
					name={'History'}
					type="number"
					inputProps={{
						min: 1,
						max: this.state.stack.length
					}}
					ref={(r) => (this.TextInput = r)}
				/>
				<PlayCircleFilledIcon
					className="Detailer_stats_gotobutton"
					onClick={(e) => {
						this.refetchData(parseInt(this.TextInput.TextField.value) - 1);
					}}
				/>
				<DeleteSweepIcon
					className="Detailer_stats_deleteleft"
					onClick={(e) => {
						this.alterHistory('left');
					}}
				/>
				<DeleteSweepIcon
					className="Detailer_stats_deleteright"
					onClick={(e) => {
						this.alterHistory('right');
					}}
				/>
				<FileCopyIcon
					className="Detailer_stats_removedup"
					onClick={(e) => {
						const { stack } = this.state;
						this.setState({
							stack: Array.from(new Set(stack)),
							currentIndex: 0
						});
					}}
				/>
				<div className="Detailer_stats_count">
					{currentIndex + 1}/{stack.length} Items
				</div>
			</div>
		);
	};
	renderDetailer = () => {
		const { data, type } = this.state;
		const sectorizedData = data
			? sectorizeData(data, type, {
					authenticated: this.context.user,
					singularSectorize: true,
					purpose: 'detail'
				})
			: null;
		if (sectorizedData) {
			return (
				<div className={`Detailer ${this.props.classes.Detailer}`}>
					{this.renderDetailerStats()}
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
		return this.props.children({
			fetchData: this.fetchData,
			Detailer: this.renderDetailer()
		});
	}
}

export default withStyles((theme) => ({
	Detailer: {
		backgroundColor: Color.rgb(convert.hex.rgb(theme.palette.background.dark)).darken(0.15).hex(),
		'& .Detailer_container-tertiary': {
			backgroundColor: Color.rgb(convert.hex.rgb(theme.palette.background.dark)).lighten(0.5).hex()
		},
		'& .Detailer_container-tertiary_item_value': {
			backgroundColor: theme.palette.background.light
		},
		'& .Detailer_container-refs_item_value_container_item': {
			backgroundColor: Color.rgb(convert.hex.rgb(theme.palette.background.dark)).lighten(0.5).hex()
		}
	}
}))(Detailer);
