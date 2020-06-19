import React, { Component } from 'react';
import moment from 'moment';
import qs from 'qs';
import axios from 'axios';
import pluralize from 'pluralize';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import PublicIcon from '@material-ui/icons/Public';
import { withStyles } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import DeleteIcon from '@material-ui/icons/Delete';

import Stack from '../../Stack/Stack';
import { AppContext } from '../../../context/AppContext';
import sectorizeData from '../../../Utils/sectorizeData';
import populateQueryParams from '../../../Utils/populateQueryParams';
import getColoredIcons from '../../../Utils/getColoredIcons';
import ChipContainer from '../../../components/Chip/ChipContainer';
import TextInput from '../../Input/TextInput/TextInput';

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

	renderDetailerStats = () => {
		const { StackState: { stack, currentIndex }, removeDuplicates, moveLeft, moveRight } = this;
		return (
			<div className="Detailer_stats">
				<ChevronLeftIcon
					className="Detailer_stats_left"
					onClick={(e) => {
						if (currentIndex > 0) {
							moveLeft();
							this.refetchData(currentIndex - 1);
						}
					}}
				/>
				<ChevronRightIcon
					className="Detailer_stats_right"
					onClick={(e) => {
						if (currentIndex !== stack.length - 1) {
							moveRight();
							this.refetchData(currentIndex + 1);
						}
					}}
				/>
				<TextInput
					className="Detailer_stats_goto"
					fullWidth={false}
					name={'History'}
					type="number"
					inputProps={{
						min: 1,
						max: stack.length
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
						this.removeFromStack('left');
					}}
				/>
				<DeleteIcon onClick={this.removeCurrentIndex} />
				<DeleteSweepIcon
					className="Detailer_stats_deleteright"
					onClick={(e) => {
						this.removeFromStack('right');
					}}
				/>
				<FileCopyIcon
					className="Detailer_stats_removedup"
					onClick={(e) => {
						removeDuplicates();
					}}
				/>
				<div className="Detailer_stats_count">
					{currentIndex + 1}/{stack.length} Items
				</div>
			</div>
		);
	};

	renderDetailer = () => {
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
		const { renderDetailer, fetchData, props: { children } } = this;
		return (
			<Stack>
				{(props) => {
					Object.entries(props).forEach(([ key, value ]) => (this[key] = value));
					return children({
						fetchData,
						Detailer: renderDetailer()
					});
				}}
			</Stack>
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
