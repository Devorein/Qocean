import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { AppContext } from '../../../context/AppContext';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import PublicIcon from '@material-ui/icons/Public';
import { withStyles } from '@material-ui/core/styles';
import Color from 'color';
import convert from 'color-convert';
import sectorizeData from '../../../Utils/sectorizeData';
import ChipContainer from '../../../components/Chip/ChipContainer';

import './Detailer.scss';
class Detailer extends Component {
	static contextType = AppContext;

	state = {
		stack: []
	};

	renderValue = (key, value) => {
		if (key.match(/^(created_at|updated_at)$/)) value = moment(value).fromNow();
		else if (key.match(/(tags)/)) value = <ChipContainer chips={value} type={'regular'} height={50} />;
		else if (key === 'public') value = <PublicIcon style={{ fill: value ? '#00a3e6' : '#f4423c' }} />;
		else if (key === 'favourite')
			value = value ? <StarIcon style={{ fill: '#f0e744' }} /> : <StarBorderIcon style={{ fill: '#ead50f' }} />;
		else if (key === 'image') {
			let src = null;
			const isLink = value.match(/^(http|data)/);
			if (isLink) src = value;
			else src = `http://localhost:5001/uploads/${value}`;
			value = <img src={src} alt={`${this.props.type}`} />;
		} else value = value.toString();
		return value;
	};
	renderDetailer = () => {
		const { type, data } = this.props;

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
									<span className={`Detailer_container_item-key Detailer_container-${sector}_item-key`}>
										{key.split('_').map((c) => c.charAt(0).toUpperCase() + c.substr(1)).join(' ')}
									</span>
									<span className={`Detailer_container_item-value Detailer_container-${sector}_item-value`}>
										{this.renderValue(key, value)}
									</span>
								</div>
							))}
						</div>
					))}
					<div className={`Detailer_container Detailer_container-refs`}>
						{Object.keys(manipulatedData.refs).map((ref) => {
							return <div key={ref}>{ref}</div>;
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
		'& .Detailer_container-tertiary_item-value': {
			backgroundColor: theme.palette.background.light
		}
	}
}))(Detailer);
