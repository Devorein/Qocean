import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { AppContext } from '../../../context/AppContext';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import PublicIcon from '@material-ui/icons/Public';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import qs from 'qs';
import Color from 'color';
import convert from 'color-convert';
import sectorizeData from '../../../Utils/sectorizeData';
import getColoredIcons from '../../../Utils/getColoredIcons';
import ChipContainer from '../../../components/Chip/ChipContainer';

import './Detailer.scss';
class Detailer extends Component {
	static contextType = AppContext;

	state = {
		stack: [],
		data: this.props.data || null
	};

	UNSAFE_componentWillReceiveProps(props) {
		if (props.data) {
			this.setState({
				data: props.data
			});
		}
	}

	fetchData = (type, id) => {
		let queryParams = {};
		if (type === 'watchers') {
			type = 'users';
			queryParams.populate = 'quizzes,questions,folders,envrionments';
			queryParams.populateFields = 'name-name-name-name';
		} else if (type === 'folders') {
			queryParams.populate = 'quizzes,watchers';
			queryParams.populateFields = 'name-username';
		} else if (type === 'quizzes') {
			queryParams.populate = 'folders,questions,watchers';
			queryParams.populateFields = 'name-name-username';
		} else if (type === 'questions') {
			queryParams.populate = 'quiz';
			queryParams.populateFields = 'name';
		} else if (type === 'environments') {
			queryParams.populate = '';
			queryParams.populateFields = '';
		}
		const queryString = qs.stringify(queryParams);

		axios.get(`http://localhost:5001/api/v1/${type}?_id=${id}&${queryString}`).then(({ data: { data } }) => {
			console.log(data);
		});
	};

	renderRefs = (data, ref) => {
		if (data.length === 0) return <div>N/A</div>;
		else
			return (
				<div
					className={`Detailer_container-refs_item_value_container Detailer_container-refs_item-${ref}_value_container`}
				>
					{data.map((item) => (
						<div
							className={`Detailer_container-refs_item_value_container_item Detailer_container-refs_item-${ref}_value_container_item`}
							key={item._id}
							onClick={(e) => {
								this.fetchData(ref, item._id);
							}}
						>
							{item.name}
						</div>
					))}
				</div>
			);
	};

	renderValue = (key, value) => {
		if (key.match(/^(created_at|updated_at)$/)) value = moment(value).fromNow();
		else if (key.match(/(tags)/)) value = <ChipContainer chips={value} type={'regular'} height={50} />;
		else if (key === 'public') value = <PublicIcon style={{ fill: value ? '#00a3e6' : '#f4423c' }} />;
		else if (key === 'favourite')
			value = value ? <StarIcon style={{ fill: '#f0e744' }} /> : <StarBorderIcon style={{ fill: '#ead50f' }} />;
		else if (key === 'icon') value = getColoredIcons(this.props.type, value);
		else if (key === 'image') {
			let src = null;
			const isLink = value ? value.match(/^(http|data)/) : `http://localhost:5001/uploads/none.png`;
			if (isLink) src = value;
			else src = `http://localhost:5001/uploads/${value}`;
			value = <img src={src} alt={`${this.props.type}`} />;
		} else value = value.toString();
		return value;
	};

	renderDetailer = () => {
		const { type } = this.props;
		const { data } = this.state;
		const manipulatedData = data
			? sectorizeData(data, type, {
					authenticated: this.context.user,
					singularSectorize: true,
					purpose: 'detail'
				})
			: null;

		if (manipulatedData) {
			return (
				<Fragment>
					{[ 'primary', 'secondary', 'tertiary' ].map((sector) => (
						<div className={`Detailer_container Detailer_container-${sector}`} key={sector}>
							{Object.entries(manipulatedData[sector]).map(([ key, value ]) => (
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
					<div className={`Detailer_container Detailer_container-refs`}>
						{Object.keys(manipulatedData.refs).map((ref) => {
							return (
								<Fragment key={ref}>
									<div className={`Detailer_container-refs_item_key Detailer_container-refs_item-${ref}_key`}>
										{ref}
									</div>
									{this.renderRefs(manipulatedData.refs[ref], ref)}
								</Fragment>
							);
						})}
					</div>
				</Fragment>
			);
		}
	};
	render() {
		return <div className={`Detailer ${this.props.classes.Detailer}`}>{this.renderDetailer()}</div>;
	}
}

export default withStyles((theme) => ({
	Detailer: {
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
