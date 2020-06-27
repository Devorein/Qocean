import React, { Component } from 'react';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import TextField from '@material-ui/core/TextField';
import * as Yup from 'yup';
import { isStrongPassword } from '../../Utils/validation';

const passwordValidation = Yup.object({
	password: Yup.string('')
		.min(8, 'Password must contain at least 8 characters')
		.test('strong-password-text', 'You need a stronger password', isStrongPassword)
		.required('Enter your password')
});

class PasswordInput extends Component {
	state = {
		showPassword: false,
		message: ''
	};

	render() {
		const { onChange, value, name = '', label, validation } = this.props;

		return (
			<TextField
				type={this.state.showPassword ? 'text' : 'password'}
				onChange={(e) => {
					if (validation)
						try {
							if (passwordValidation._nodes.includes('password'))
								passwordValidation.validateSyncAt('password', e.target.value);
						} catch (err) {
							this.setState({
								message: err.message
							});
						}
					onChange(e);
				}}
				name={name ? name : 'password'}
				label={label ? label : name.split('_').map((chunk) => chunk.charAt(0).toUpperCase() + chunk.substr(1))}
				value={value}
				fullWidth
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<IconButton
								aria-label="toggle password visibility"
								onClick={(e) => this.setState({ showPassword: !this.state.showPassword })}
							>
								{this.state.showPassword ? <Visibility /> : <VisibilityOff />}
							</IconButton>
						</InputAdornment>
					)
				}}
				helperText={this.state.message !== '' ? this.state.message : this.props.helperText}
			/>
		);
	}
}

export default PasswordInput;
