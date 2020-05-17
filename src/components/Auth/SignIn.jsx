import React, { Component } from 'react';
import { Formik } from 'formik';
import axios from 'axios';
import { isStrongPassword } from '../../Utils/validation';
class SignIn extends Component {
	submitForm = (values) => {
		axios
			.post(`http://localhost:5001/api/v1/auth/login`, {
				email: values.email,
				password: values.password
			})
			.then((res) => {
				console.log(res);
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
					else if (!isStrongPassword(values.password)) errors.password = 'Need a stronger password';
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
							<button type="submit" disabled={isSubmitting}>
								Submit
							</button>
						</form>
					);
				}}
			</Formik>
		);
	}
}

export default SignIn;
