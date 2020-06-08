import React, { Component } from 'react';

import Chip from '@material-ui/core/Chip';
import CancelIcon from '@material-ui/icons/Cancel';
import changeColor from '../../Utils/changeColor';

class DeletableChip extends Component {
	render() {
		const { tag, onDelete, id } = this.props;
		let [ label, bg ] = tag.split(':');
		if (!bg || bg === '') bg = 'black';
		return (
			<Chip
				label={label}
				deleteIcon={<CancelIcon style={{ fill: changeColor(bg) }} />}
				style={{ backgroundColor: bg, color: changeColor(bg) }}
				onDelete={onDelete.bind(null, label)}
			/>
		);
	}
}

export default DeletableChip;
