import Chip from '@material-ui/core/Chip';

import React, { Component } from 'react';

class DeletableChip extends Component {
	render() {
		const { tag, onDelete } = this.props;
		const [ label, bg ] = tag.split(':');
		return (
			<div>
				<Chip label={label} style={{ backgroundColor: bg }} onDelete={onDelete} />
			</div>
		);
	}
}

export default DeletableChip;
