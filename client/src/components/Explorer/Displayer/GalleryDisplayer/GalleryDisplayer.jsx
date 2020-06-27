import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import InputSelect from '../../../Input/InputSelect';

import DataDisplayer from '../../../Visualizations/DataDisplayer/DataDisplayer';

import './GalleryDisplayer.scss';

class GalleryDisplayer extends Component {
	state = {
		colsCount: 3
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
		const { type, page, data, classes, selected } = this.props;
		return (
			<Fragment>
				{this.renderColSelection()}
				<DataDisplayer
					className={classes.GalleryDisplayer_item}
					type={type}
					selected={selected}
					page={page}
					view={'Gallery'}
					data={data}
					style={{ gridTemplateColumns: `${'1fr '.repeat(this.state.colsCount)}` }}
					targetComp="Displayer"
				/>
			</Fragment>
		);
	}
}

export default withStyles((theme) => ({
	GalleryDisplayer_item: {
		'& .GalleryDisplayer_Item': {
			backgroundColor: theme.lighten(theme.palette.background.dark, 0.5)
		},
		'&. GalleryDisplayer_Item--selected': {
			backgroundColor: theme.darken(theme.palette.background.dark, 0.25)
		},
		'& .GalleryDisplayer_Item_Sector-tertiary': {
			backgroundColor: theme.lighten(theme.palette.background.dark, 0.25)
		},
		'& .GalleryDisplayer_Item_Sector-tertiary_Item_value': {
			backgroundColor: theme.palette.background.light
		}
	}
}))(GalleryDisplayer);
