import React, { Component } from 'react';
import { Formik } from 'formik';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

import { isStrongPassword } from '../../Utils/validation';
class SignIn extends Component {
	submitForm = ({ name, email, username, password }) => {
		axios
			.post(`http://localhost:5001/api/v1/auth/register`, {
				name,
				email,
				username,
				password
			})
			.then((res) => {
				localStorage.setItem('token', res.data.token);
				this.props.history.push('/');
				this.props.refetch();
			})
			.catch((err) => {
				console.log(err.response.data.error);
			});
	};
	render() {
		return (
			<Formik
				initialValues={{ email: '', password: '' }}
				onSubmit={this.submitForm}
				validate={(values) => {
					const errors = {};
					if (!values.email) errors.email = 'Required';
					else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email))
						errors.email = 'Invalid email address';
					if (!values.name) errors.name = 'Required';
					if (!values.username) errors.username = 'Required';
					if (!values.password) errors.password = 'Required';

					if (!isStrongPassword(values.password)) errors.password = 'Need a stronger password';
					return errors;
				}}
			>
				{(props) => {
					const {
						values,
						touched,
						errors,
						dirty,
						isSubmitting,
						handleChange,
						handleBlur,
						handleSubmit,
						handleReset
					} = props;
					return (
						<form onSubmit={handleSubmit}>
							<label htmlFor="name" style={{ display: 'block' }}>
								Name
							</label>
							<input
								id="name"
								placeholder="Enter your name"
								type="text"
								value={values.name}
								onChange={handleChange}
								onBlur={handleBlur}
								className={errors.name && touched.name ? 'text-input error' : 'text-input'}
							/>
							{errors.name && touched.name && <div className="input-feedback">{errors.name}</div>}

							<label htmlFor="username" style={{ display: 'block' }}>
								Username
							</label>
							<input
								id="username"
								placeholder="Enter your username"
								type="text"
								value={values.username}
								onChange={handleChange}
								onBlur={handleBlur}
								className={errors.username && touched.username ? 'text-input error' : 'text-input'}
							/>
							{errors.username && touched.username && <div className="input-feedback">{errors.username}</div>}

							<label htmlFor="email" style={{ display: 'block' }}>
								Email
							</label>
							<input
								id="email"
								placeholder="Enter your email"
								type="text"
								value={values.email}
								onChange={handleChange}
								onBlur={handleBlur}
								className={errors.email && touched.email ? 'text-input error' : 'text-input'}
							/>
							{errors.email && touched.email && <div className="input-feedback">{errors.email}</div>}

							<label htmlFor="password" style={{ display: 'block' }}>
								Password
							</label>

							<input
								type="password"
								name="password"
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.password}
							/>
							{errors.password && touched.password && <div className="input-feedback">{errors.password}</div>}

							<button type="button" className="outline" onClick={handleReset} disabled={!dirty || isSubmitting}>
								Reset
							</button>
							<button type="submit" disabled={isSubmitting || Object.keys(errors).length >= 1}>
								Submit
							</button>
						</form>
					);
				}}
			</Formik>
		);
	}
}

export default withRouter(SignIn);
