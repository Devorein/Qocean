import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Color from 'color';
import convert from 'color-convert';

import './ListDisplayer.scss';
class ListDisplayer extends Component {
	renderListDisplayer = () => {
		const { type, data, classes, currentSelected } = this.props;
		return data.map((item, index) => {
			return (
				<div
					className={`ListDisplayer_item ${classes.ListDisplayer_item} ${currentSelected === index
						? 'ListDisplayer_item--selected'
						: ''}`}
					key={item._id}
				>
					{item.checked}
					<div className="ListDisplayer_item_container ListDisplayer_item_container-actions">{item.actions}</div>
					{[ 'primary', 'secondary', 'tertiary' ].map((key, index) => {
						return (
							<div
								key={`${type}${key}${index}`}
								className={`ListDisplayer_item_container ListDisplayer_item_container-${key}`}
							>
								{Object.entries(item[key]).map(([ key, val ], index) => (
									<span
										key={`${type}${key}${index}`}
										className={`ListDisplayer_item_container_item ListDisplayer_item_container-${key}_item`}
									>
										{val}
									</span>
								))}
							</div>
						);
					})}
				</div>
			);
		});
	};
	render() {
		return <div className="ListDisplayer">{this.renderListDisplayer()}</div>;
	}
}

export default withStyles((theme) => ({
	ListDisplayer_item: {
		backgroundColor: Color.rgb(convert.hex.rgb(theme.palette.background.dark)).lighten(0.5).hex(),
		'&.ListDisplayer_item--selected': {
			backgroundColor: Color.rgb(convert.hex.rgb(theme.palette.background.dark)).darken(0.25).hex()
		}
	}
}))(ListDisplayer);
