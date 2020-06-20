import React, { Component } from 'react';

import Chip from '@material-ui/core/Chip';
import changeColor from '../../Utils/changeColor';
import Icon from '../../components/Icon/Icon';

class DeletableChip extends Component {
	render() {
		const { tag, onDelete } = this.props;
		let [ label, bg ] = tag.split(':');
		if (!bg || bg === '') bg = 'black';
		return (
			<Chip
				label={label}
				deleteIcon={<Icon icon="cancel" style={{ fill: changeColor(bg) }} popoverText="Delete chip" />}
				style={{ backgroundColor: bg, color: changeColor(bg) }}
				onDelete={onDelete.bind(null, label)}
			/>
		);
	}
}

export default DeletableChip;
