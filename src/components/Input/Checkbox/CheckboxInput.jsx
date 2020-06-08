import React, { Component } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

class CheckboxInput extends Component {
	decideLabel = (name, label) => {
		if (label) return label;
		else return name.split('_').map((name) => name.charAt(0).toUpperCase() + name.substr(1)).join(' ');
	};

	render() {
		const { className = '', name = '', onChange, checked, handleBlur, label = '' } = this.props;
		return (
			<FormControlLabel
				className={className}
				control={<Checkbox color={'primary'} checked={checked} name={name} onChange={onChange} onBlur={handleBlur} />}
				label={this.decideLabel(name, label)}
			/>
		);
	}
}

export default CheckboxInput;
