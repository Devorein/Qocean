import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Color from 'color';
import convert from 'color-convert';

class DataDisplayer extends Component {
	renderSector = (sector, item) => {
		const { type } = this;
		const { view } = this.props;
		if (!sector.match(/(actions|checked)/)) {
			return Object.entries(item[sector]).map(([ key, val ], index) => (
				<span
					key={`${type}${sector}${key}${index}`}
					className={`${view}Displayer_Item_Sector_Item ${view}Displayer_Item_Sector_Item-${key}_item`}
				>
					{val}
				</span>
			));
		}

		return (
			<span
				key={`${type}${sector}${sector}`}
				className={`${view}Displayer_Item_Sector_Item ${view}Displayer_Item_Sector_Item-${sector}_item`}
			>
				{item[sector]}
			</span>
		);
	};

	render() {
		const { data, classes, currentSelected, view } = this.props;
		this.page = this.props.page.toLowerCase();
		this.type = this.props.type.toLowerCase();

		const { page, type } = this;

		const sectors = [ 'checked', 'actions', 'primary', 'secondary' ];
		if (page !== 'self') sectors.push('ref', 'tertiary');
		else sectors.push('tertiary');
		return data.map((item, index) => {
			return (
				<div
					className={`${view}Displayer_Item ${classes.DataDisplayer_Item} ${currentSelected === index
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
		});
	}
}

export default withStyles((theme) => ({
	DataDisplayer_Item: (props) => {
		return {
			backgroundColor: Color.rgb(convert.hex.rgb(theme.palette.background.dark)).lighten(0.5).hex(),
			[`&.${props.view}Displayer_Item--selected`]: {
				backgroundColor: Color.rgb(convert.hex.rgb(theme.palette.background.dark)).darken(0.25).hex()
			}
		};
	}
}))(DataDisplayer);
