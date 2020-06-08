import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import CheckboxInput from '../../../Input/Checkbox/CheckboxInput';
import Color from 'color';
import convert from 'color-convert';
import './GalleryDisplayer.scss';

class GalleryDisplayer extends Component {
	renderGalleryDisplayer = () => {
		const { type, data, classes, setChecked } = this.props;
		return data.map((item, index) => {
			return (
				<div className={`GalleryDisplayer_item ${classes.GalleryDisplayer_item}`} key={item._id}>
					<CheckboxInput onChange={setChecked.bind(null, index)} checked={item.checked} />
					<div className="GalleryDisplayer_item_container GalleryDisplayer_item_container-actions">{item.actions}</div>
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
													{_key.split('_').map((chunk) => chunk.charAt(0).toUpperCase() + chunk.substr(1)).join(' ')}
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
		});
	};
	render() {
		return (
			<div className={`GalleryDisplayer-${this.props.type} GalleryDisplayer`}>{this.renderGalleryDisplayer()}</div>
		);
	}
}

export default withStyles((theme) => ({
	GalleryDisplayer_item: {
		backgroundColor: theme.palette.background.main,
		'& .GalleryDisplayer_item_container-tertiary': {
			backgroundColor: Color.rgb(convert.hex.rgb(theme.palette.background.dark)).lighten(0.25).hex()
		},
		'& .GalleryDisplayer_item_container_item-value': {
			backgroundColor: theme.palette.background.light
		}
	}
}))(GalleryDisplayer);
