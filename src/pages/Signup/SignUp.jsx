import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import InputForm from '../../components/Form/InputForm';
import * as Yup from 'yup';
import { isStrongPassword, isAlphaNumericOnly } from '../../Utils/validation';

const validationSchema = Yup.object({
	name: Yup.string('Enter a name').required('Name is required'),
	username: Yup.string('Enter a username')
		.min(3, 'Username mustbe atleast 3 characters long')
		.max(10, 'Username cannot be more than 10 characters long')
		.test('isAlphaNumericOnly', 'Username should be alphanumeric only', isAlphaNumericOnly)
		.required('Username is required'),
	email: Yup.string('Enter your email').email('Enter a valid email').required('Email is required'),
	password: Yup.string('')
		.min(8, 'Password must contain at least 8 characters')
		.test('strong-password-text', 'You need a stronger password', isStrongPassword)
		.required('Enter your password'),
	confirm_password: Yup.string('Enter your password')
		.required('Confirm your password')
		.oneOf([ Yup.ref('password') ], 'Password does not match')
});

class SignIn extends Component {
	state = {
		responseMsg: {}
	};

	submitForm = ({ name, email, username, password }, { setSubmitting }) => {
		axios
			.post(`http://localhost:5001/api/v1/auth/register`, {
				name,
				email,
				username,
				password
			})
			.then((res) => {
				this.setState(
					{
						responseMsg: {
							state: 'success',
							msg: 'Successfully signed up'
						}
					},
					() => {
						setTimeout(() => {
							localStorage.setItem('token', res.data.token);
							this.props.history.push('/');
							this.props.refetch();
						}, 5000);
					}
				);
			})
			.catch((err) => {
				setSubmitting(false);
				this.setState({
					responseMsg: {
						state: 'error',
						msg: err.response.data.error
					}
				});
			});
	};

	render() {
		return (
			<div className="signup">
				<InputForm
					onSubmit={this.submitForm}
					validationSchema={validationSchema}
					inputs={[
						{ name: 'name', startAdornment: 'person' },
						{ name: 'username', startAdornment: 'person' },
						{ name: 'email', startAdornment: 'email' },
						{ name: 'password' },
						{ name: 'confirm_password' }
					]}
					responseMsg={this.state.responseMsg}
				/>
			</div>
		);
	}
}

export default withRouter(SignIn);
