import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';

class TextInput extends Component {
	render () {
		const {
			name,
			value,
			onChange,
			handleBlur,
			fullWidth = true,
			errorText = false,
			type = 'text',
			inputProps = {},
			disabled = false,
			className,
			label
		} = this.props;

		return (
			<TextField
				name={name}
				inputRef={(r) => {
					this.TextField = r;
				}}
				value={value}
				type={type}
				disabled={disabled}
				multiline={type === 'textarea' ? true : false}
				inputProps={inputProps}
				onChange={onChange}
				fullWidth={fullWidth}
				onBlur={handleBlur}
				error={Boolean(errorText)}
				helperText={errorText}
				className={className}
				label={(label || name).split('_').map((name) => name.charAt(0).toUpperCase() + name.substr(1)).join(' ')}
			/>
		);
	}
}

export default TextInput;
