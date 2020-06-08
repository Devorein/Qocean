import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import CheckboxInput from '../../../Input/Checkbox/CheckboxInput';
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
								{Object.entries(item[key]).map(([ key, val ], index) => (
									<span
										key={`${type}${key}${index}`}
										className={`GalleryDisplayer_item_container_item GalleryDisplayer_item_container-${key}_item`}
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
		return <div className="GalleryDisplayer">{this.renderGalleryDisplayer()}</div>;
	}
}

export default withStyles((theme) => ({
	GalleryDisplayer_item: {
		backgroundColor: theme.palette.background.main
	}
}))(GalleryDisplayer);
