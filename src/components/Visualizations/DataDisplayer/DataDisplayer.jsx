import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
class DataDisplayer extends Component {
	renderSectorKey = (sector, key) => {
		const { view } = this.props;

		const SectorKey = (
			<div
				className={`${view}Displayer_Item_Sector_Item_key ${view}Displayer_Item_Sector-${sector}_Item_key ${view}Displayer_Item_Sector-${sector}_Item-${key}_key ${view}Displayer_Item_Sector_Item-${key}_key`}
			>
				{key.split('_').map((chunk) => chunk.charAt(0).toUpperCase() + chunk.substr(1)).join(' ')}
			</div>
		);

		if (view === 'List') return null;
		else if (view === 'Gallery' && sector === 'tertiary') return SectorKey;
		else if (view === 'Detailer') return SectorKey;
	};

	renderSector = (sector, item) => {
		const { type } = this;
		const { view } = this.props;
		if (!sector.match(/(actions|checked)/)) {
			return Object.entries(item[sector]).map(([ key, val ], index) => {
				return (
					<span
						key={`${type}${sector}${key}${index}`}
						className={`${view}Displayer_Item_Sector_Item ${view}Displayer_Item_Sector-${sector}_Item ${view}Displayer_Item_Sector-${sector}_Item-${key} ${view}Displayer_Item_Sector_Item-${key}`}
					>
						{this.renderSectorKey(sector, key)}
						<div
							className={`${view}Displayer_Item_Sector_Item_value ${view}Displayer_Item_Sector-${sector}_Item_value ${view}Displayer_Item_Sector-${sector}_Item-${key}_value ${view}Displayer_Item_Sector_Item-${key}_value`}
						>
							{val}
						</div>
					</span>
				);
			});
		}
		return (
			<span
				key={`${type}${sector}${sector}`}
				className={`${view}Displayer_Item_Sector_Item ${view}Displayer_Item_Sector_Item-${sector}`}
			>
				{item[sector]}
			</span>
		);
	};

	render() {
		const { data, classes, selected, view, className } = this.props;
		this.page = this.props.page.toLowerCase();
		this.type = this.props.type.toLowerCase();
		const { page, type } = this;
		const sectors = [ 'primary', 'secondary' ];
		if (page !== 'detailer') sectors.unshift('checked', 'actions');
		if (page !== 'self') sectors.push('ref', 'tertiary');
		else sectors.push('tertiary');
		return (
			<div
				className={`${view}Displayer ${view}Displayer-${type.charAt(0).toUpperCase() + type.substr(1)} ${className}`}
				style={this.props.style || {}}
			>
				{data.map((item, index) => {
					return (
						<div
							className={`${view}Displayer_Item ${classes.DataDisplayer_Item} ${selected === index
								? `${view}Displayer_Item--selected`
								: ''}`}
							key={item._id}
						>
							{sectors.map((sector, index) => {
								return (
									<div
										key={`${type}${page}${sector}${index}`}
										className={`${view}Displayer_Item_Sector ${view}Displayer_Item_Sector-${sector}`}
									>
										{this.renderSector(sector, item)}
									</div>
								);
							})}
						</div>
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
