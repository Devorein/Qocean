import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Spring, animated } from 'react-spring/renderprops';

class DataDisplayer extends Component {
	renderSectorKey = (item, sector, key) => {
		const { view, targetComp } = this.props;

		const SectorKeyValue =
			sector !== 'refs' ? (
				key.split('_').map((chunk) => chunk.charAt(0).toUpperCase() + chunk.substr(1)).join(' ')
			) : (
				<Fragment>
					<div
						className={`${view}${targetComp}_Item_Sector_Item_key_name ${view}${targetComp}_Item_Sector-${sector}_Item_key_name ${view}${targetComp}_Item_Sector-${sector}_Item-${key}_key_name ${view}${targetComp}_Item_Sector_Item-${key}_key_name`}
					>
						{key}
					</div>
					<div
						className={`${view}${targetComp}_Item_Sector_Item_key_length ${view}${targetComp}_Item_Sector-${sector}_Item_key_length ${view}${targetComp}_Item_Sector-${sector}_Item-${key}_key_length ${view}${targetComp}_Item_Sector_Item-${key}_key_length`}
					>
						{item[sector][key].length}
					</div>
				</Fragment>
			);
		const SectorKey = (
			<div
				className={`${view}${targetComp}_Item_Sector_Item_key ${view}${targetComp}_Item_Sector-${sector}_Item_key ${view}${targetComp}_Item_Sector-${sector}_Item-${key}_key ${view}${targetComp}_Item_Sector_Item-${key}_key`}
			>
				{SectorKeyValue}
			</div>
		);

		if (targetComp === 'Displayer') {
			if (view === 'List') return null;
			else if (view === 'Gallery' && sector === 'tertiary') return SectorKey;
			else if (view === 'Detailer') return SectorKey;
		} else if (targetComp === 'Detailer' && !sector.match(/(primary)/)) return SectorKey;
	};

	renderSectorValue = (sector, val, key) => {
		const { view, targetComp } = this.props;

		const renderValue = (val) => {
			return (
				<div
					className={`${view}${targetComp}_Item_Sector_Item_value_item ${view}${targetComp}_Item_Sector-${sector}_Item_value_item ${view}${targetComp}_Item_Sector-${sector}_Item-${key}_value_item ${view}${targetComp}_Item_Sector_Item-${key}_value_item`}
					key={val._id}
					onClick={this.props.onRefClick ? this.props.onRefClick.bind(null, key, val._id) : null}
				>
					{val.username || val.name}
				</div>
			);
		};
		let sectorValue = null;
		if (!sector.match(/(refs|ref)/)) sectorValue = renderValue({ name: val });
		else if (sector === 'refs') sectorValue = val.map((val) => renderValue(val));
		else if (sector === 'ref') sectorValue = renderValue(val);
		return (
			<div
				className={`${view}${targetComp}_Item_Sector_Item_value ${view}${targetComp}_Item_Sector-${sector}_Item_value ${view}${targetComp}_Item_Sector-${sector}_Item-${key}_value ${view}${targetComp}_Item_Sector_Item-${key}_value`}
			>
				{sectorValue}
			</div>
		);
	};

	renderSector = (sector, item) => {
		const { type } = this;
		const { view, targetComp } = this.props;
		if (!sector.match(/(actions|checked)/)) {
			return Object.entries(item[sector]).map(([ key, val ], index) => {
				return (
					<span
						key={`${type}${sector}${key}${index}`}
						className={`${view}${targetComp}_Item_Sector_Item ${view}${targetComp}_Item_Sector-${sector}_Item ${view}${targetComp}_Item_Sector-${sector}_Item-${key} ${view}${targetComp}_Item_Sector_Item-${key}`}
					>
						{this.renderSectorKey(item, sector, key)}
						{this.renderSectorValue(sector, val, key)}
					</span>
				);
			});
		}
		return (
			<span
				key={`${type}${sector}${sector}`}
				className={`${view}${targetComp}_Item_Sector_Item ${view}${targetComp}_Item_Sector_Item-${sector}`}
			>
				{item[sector]}
			</span>
		);
	};

	render() {
		const { data, classes, selected = -1, view, className, targetComp } = this.props;
		this.page = this.props.page.toLowerCase();
		this.type = this.props.type.toLowerCase();
		const { page, type } = this;
		const sectors = [ 'primary', 'secondary' ];
		if (targetComp === 'Detailer') {
			sectors.push('ref', 'tertiary', 'refs');
		} else if (targetComp === 'Displayer') {
			sectors.unshift('checked', 'actions');
			if (page !== 'self') sectors.push('ref', 'tertiary');
			else sectors.push('tertiary');
		}
		return (
			<div
				className={`${view}${targetComp} ${view}${targetComp}-${type.charAt(0).toUpperCase() +
					type.substr(1)} ${className}`}
				style={this.props.style || {}}
			>
				{data.map((item, index) => {
					return (
						<Spring
							key={item._id}
							from={{ transform: 'translateX(-100%)', opacity: 0 }}
							to={{ transform: 'translateX(0)', opacity: 1 }}
							delay={index * 250}
							native
						>
							{(style) => (
								<animated.div
									className={`${view}${targetComp}_Item ${classes.DataDisplayer_Item} ${selected === index
										? `${view}${targetComp}_Item--selected`
										: ''}`}
									style={style}
								>
									{sectors.map((sector, index) => {
										return (
											<div
												key={`${type}${page}${sector}${index}`}
												className={`${view}${targetComp}_Item_Sector ${view}${targetComp}_Item_Sector-${sector}`}
											>
												{this.renderSector(sector, item)}
											</div>
										);
									})}
								</animated.div>
							)}
						</Spring>
					);
				})}
			</div>
		);
	}
}

export default withStyles((theme) => ({
	DataDisplayer_Item: (props) => {
		return {
			backgroundColor: theme.lighten(theme.palette.background.dark, 0.5),
			[`&.${props.view}Displayer_Item--selected`]: {
				backgroundColor: `${theme.darken(theme.palette.background.dark, 0.25)} !important`
			}
		};
	}
}))(DataDisplayer);
