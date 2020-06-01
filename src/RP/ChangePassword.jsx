import React, { Component } from 'react';
import * as Yup from 'yup';
import { isStrongPassword } from '../Utils/validation';
import GenericButton from '../components/Buttons/GenericButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import InputForm from '../components/Form/InputForm';
import PasswordInput from '../components/Input/PasswordInput';
import shortid from 'shortid';

const changePasswordValidation = Yup.object({
	new_password: Yup.string('')
		.min(8, 'Password must contain at least 8 characters')
		.test('strong-password-text', 'You need a stronger password', isStrongPassword)
		.required('Enter your password'),
	confirm_password: Yup.string('Enter your password')
		.required('Confirm your password')
		.oneOf([ Yup.ref('new_password') ], 'Password does not match')
});

class ChangePassword extends Component {
	state = {
		showChangePasswordForm: false,
		showPassword: false,
		password: '',
		disable: false
	};

	handleClickShowPassword = () => {
		this.setState({ showPassword: !this.state.showPassword });
	};

	decideLabel = (name, label) => {
		if (label) return label;
		else return name.split('_').map((name) => name.charAt(0).toUpperCase() + name.substr(1)).join(' ');
	};

	change = (name, e) => {
		const { handleChange, setFieldTouched } = this.props;
		if (e.persist) e.persist();
		handleChange(e);
		setFieldTouched(name, true, false);
	};

	formikProps = (name) => {
		const { errors, values, touched } = this.props;
		return {
			type: this.state.showPassword ? 'text' : 'password',
			fullWidth: true,
			name,
			value: values[name],
			onChange: this.change.bind(null, name),
			error: touched[name] && Boolean(errors[name]),
			helperText: touched[name] ? errors[name] : '',
			label: this.decideLabel(name),
			InputProps: {
				endAdornment: (
					<InputAdornment position="end">
						<IconButton aria-label="toggle password visibility" onClick={this.handleClickShowPassword}>
							{this.state.showPassword ? <Visibility /> : <VisibilityOff />}
						</IconButton>
					</InputAdornment>
				)
			}
		};
	};

	render() {
		return (
			<InputForm
				classNames={'password_form'}
				passFormAsProp={true}
				validationSchema={changePasswordValidation}
				formButtons={false}
				validateOnMount={true}
				inputs={[
					{
						name: 'new_password',
						type: 'password',
						helperText: this.state.message,
						fieldHandler: (value) => {
							let message = '',
								disabled = false;
							if (value === this.state.password && this.state.password !== '') {
								message = 'You cannot set new password same as the old one';
								disabled = true;
							}
							this.setState({
								message,
								disabled
							});
						}
					},
					{ name: 'confirm_password', type: 'password' }
				]}
			>
				{({ values, errors, isValid, setValues, inputs }) => {
					return this.props.children({
						button: (
							<GenericButton
								text={!this.state.showChangePasswordForm ? 'Change Pass' : 'Revert Pass'}
								onClick={(e) => {
									this.setState({ showChangePasswordForm: !this.state.showChangePasswordForm });
									setValues({
										new_password: '',
										confirm_password: ''
									});
								}}
							/>
						),
						formData: {
							values,
							errors,
							isValid,
							showChangePasswordForm: this.state.showChangePasswordForm,
							password: this.state.password
						},
						inputs: this.state.showChangePasswordForm ? inputs : null,
						disabled: this.state.disabled,
						passwordInput: {
							type: 'component',
							component: (
								<PasswordInput
									key={'current_password'}
									value={this.state.password}
									onChange={(e) => {
										e.persist();
										let message = '',
											disabled = false;
										if (values.new_password === e.target.value && this.state.password !== '') {
											message = 'You cannot set new password same as the old one';
											disabled = true;
										}

										this.setState({
											password: e.target.value,
											message,
											disabled
										});
									}}
									helperText={this.state.message}
									validation={false}
								/>
							)
						}
					});
				}}
			</InputForm>
		);
	}
}

export default ChangePassword;
