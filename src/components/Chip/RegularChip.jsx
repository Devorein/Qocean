import React, { Component } from 'react';

import Chip from '@material-ui/core/Chip';
import changeColor from '../../Utils/changeColor';

class RegularChip extends Component {
	render() {
		const { tag } = this.props;
		let [ label, bg ] = tag.split(':');
		if (!bg || bg === '') bg = 'black';
		return <Chip label={label} style={{ backgroundColor: bg, color: changeColor(bg) }} />;
	}
}

export default RegularChip;
