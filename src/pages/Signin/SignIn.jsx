import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import InputForm from '../../components/Form/InputForm';
import CustomSnackbars from '../../components/Snackbars/CustomSnackbars';
import './Signin.scss';

import * as Yup from 'yup';

const validationSchema = Yup.object({
	email: Yup.string('Enter your email').email('Enter a valid email').required('Email is required'),
	password: Yup.string('Enter your password').required('Password is required')
});

class SignIn extends Component {
	submitForm = ({ email, password }, { setSubmitting }) => {
		axios
			.post(`http://localhost:5001/api/v1/auth/login`, {
				email,
				password
			})
			.then((res) => {
				localStorage.setItem('token', res.data.token);
				this.changeResponse('Success', 'Successfully signed in', 'success');
				setTimeout(() => {
					this.props.history.push('/');
					this.props.refetch();
				}, 2500);
			})
			.catch((err) => {
				setSubmitting(false);
				this.changeResponse('An error occurred', err.response.data.error, 'error');
			});
	};

	render() {
		return (
			<CustomSnackbars>
				{({ changeResponse }) => {
					this.changeResponse = changeResponse;
					return (
						<div className="signin">
							<InputForm
								onSubmit={this.submitForm}
								validationSchema={validationSchema}
								inputs={[
									{
										name: 'email',
										startAdornment: 'email'
									},
									{ name: 'password' }
								]}
							/>
						</div>
					);
				}}
			</CustomSnackbars>
		);
	}
}

export default withRouter(SignIn);
