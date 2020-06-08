import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Color from 'color';
import convert from 'color-convert';
import InputSelect from '../../../Input/InputSelect';

import './GalleryDisplayer.scss';

class GalleryDisplayer extends Component {
	state = {
		colsCount: 3
	};

	renderGalleryDisplayer = () => {
		const { type, data, classes, currentSelected } = this.props;
		return (
			<div
				className="GalleryDisplayer_container"
				style={{ gridTemplateColumns: `${'1fr '.repeat(this.state.colsCount)}` }}
			>
				{data.map((item, index) => {
					return (
						<div
							className={`GalleryDisplayer_item ${classes.GalleryDisplayer_item} ${currentSelected === index
								? 'GalleryDisplayer_item--selected'
								: ''}`}
							key={item._id}
						>
							{item.checked}
							<div className="GalleryDisplayer_item_container GalleryDisplayer_item_container-actions">
								{item.actions}
							</div>
							{[ 'primary', 'secondary', 'tertiary' ].map((key, index) => {
								return (
									<div
										key={`${type}${key}${index}`}
										className={`GalleryDisplayer_item_container GalleryDisplayer_item_container-${key}`}
									>
										{Object.entries(item[key]).map(([ _key, val ], index) => (
											<span
												key={`${type}${_key}${index}`}
												className={`GalleryDisplayer_item_container_item GalleryDisplayer_item_container-${_key}_item`}
											>
												{key.match(/(tertiary)/) ? (
													<Fragment>
														<span className="GalleryDisplayer_item_container_item-key">
															{_key
																.split('_')
																.map((chunk) => chunk.charAt(0).toUpperCase() + chunk.substr(1))
																.join(' ')}
														</span>
														<span className="GalleryDisplayer_item_container_item-value">{val}</span>
													</Fragment>
												) : (
													<span className="GalleryDisplayer_item_container_item">{val}</span>
												)}
											</span>
										))}
									</div>
								);
							})}
						</div>
					);
				})}
			</div>
		);
	};

	renderColSelection = () => {
		return (
			<InputSelect
				fullWidth={false}
				name="Column Count"
				className="GalleryDisplayer_colcount"
				value={this.state.colsCount}
				onChange={(e) => {
					this.setState({ colsCount: e.target.value });
				}}
				selectItems={[ { value: 2, text: 'Two' }, { value: 3, text: 'Three' }, { value: 4, text: 'Four' } ]}
			/>
		);
	};
	render() {
		return (
			<div className={`GalleryDisplayer-${this.props.type} GalleryDisplayer`}>
				{this.renderColSelection()}
				{this.renderGalleryDisplayer()}
			</div>
		);
	}
}

export default withStyles((theme) => ({
	GalleryDisplayer_item: {
		backgroundColor: Color.rgb(convert.hex.rgb(theme.palette.background.dark)).lighten(0.5).hex(),
		'&.GalleryDisplayer_item--selected': {
			backgroundColor: Color.rgb(convert.hex.rgb(theme.palette.background.dark)).darken(0.25).hex()
		},
		'& .GalleryDisplayer_item_container-tertiary': {
			backgroundColor: Color.rgb(convert.hex.rgb(theme.palette.background.dark)).lighten(0.25).hex()
		},
		'& .GalleryDisplayer_item_container_item-value': {
			backgroundColor: theme.palette.background.light
		}
	}
}))(GalleryDisplayer);
