import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';

class TextInput extends Component {
	render() {
		const { name, value, onChange, handleBlur, fullWidth = true, errorText = false } = this.props;

		return (
			<TextField
				name={name}
				value={value}
				type={'text'}
				onChange={onChange}
				fullWidth
				onBlur={handleBlur}
				error={Boolean(errorText)}
				helperText={errorText}
				label={name.split('_').map((name) => name.charAt(0).toUpperCase() + name.substr(1)).join(' ')}
			/>
		);
	}
}

export default TextInput;
