import React, { Component } from 'react';

import Chip from '@material-ui/core/Chip';
import CancelIcon from '@material-ui/icons/Cancel';
import changeColor from '../../Utils/changeColor';

class DeletableChip extends Component {
	render() {
		const { tag, onDelete } = this.props;
		const [ label, bg ] = tag.split(':');
		return (
			<Chip
				label={label}
				deleteIcon={<CancelIcon style={{ fill: changeColor(bg) }} />}
				style={{ backgroundColor: bg, color: changeColor(bg) }}
				onDelete={onDelete}
			/>
		);
	}
}

export default DeletableChip;
