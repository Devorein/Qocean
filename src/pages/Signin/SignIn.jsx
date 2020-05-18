import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import InputForm from '../../components/Form/InputForm';

import * as Yup from 'yup';

const validationSchema = Yup.object({
	email: Yup.string('Enter your email').email('Enter a valid email').required('Email is required'),
	password: Yup.string('Enter your password').required('Password is required')
});

class SignIn extends Component {
	state = {
		errMsg: ''
	};

	submitForm = ({ email, password }, { setSubmitting }) => {
		axios
			.post(`http://localhost:5001/api/v1/auth/login`, {
				email,
				password
			})
			.then((res) => {
				localStorage.setItem('token', res.data.token);
				this.props.history.push('/');
				this.props.refetch();
			})
			.catch((err) => {
				setSubmitting(false);
				this.setState({
					errMsg: err.response.data.error
				});
			});
	};

	render() {
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
					errMsg={this.state.errMsg}
				/>;
			</div>
		);
	}
}

export default withRouter(SignIn);
