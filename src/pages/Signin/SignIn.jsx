import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import InputForm from '../../components/Form/InputForm';

import * as Yup from 'yup';

const validationSchema = Yup.object({
	email: Yup.string('Enter your email').email('Enter a valid email').required('Email is required'),
	password: Yup.string('').required('Enter your password')
});

class SignIn extends Component {
	state = {
		errMsg: ''
	};

	submitForm = (values, { setSubmitting }) => {
		axios
			.post(`http://localhost:5001/api/v1/auth/login`, {
				email: values.email,
				password: values.password
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
					values={{ email: '', password: '' }}
					errMsg={this.state.errMsg}
				/>;
			</div>
		);
	}
}

export default withRouter(SignIn);
