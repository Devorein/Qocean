import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import changeColor from '../../Utils/changeColor';

class RegularChip extends Component {
	render() {
		const { tag, classes } = this.props;
		let [ label, bg ] = tag.split(':');
		if (!bg || bg === '') bg = 'black';
		return <Chip className={classes.chip} label={label} style={{ backgroundColor: bg, color: changeColor(bg) }} />;
	}
}

export default withStyles((theme) => ({
	chip: {
		borderRadius: 3,
		margin: 3
	}
}))(RegularChip);
