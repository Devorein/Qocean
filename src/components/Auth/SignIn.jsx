import React, { Component } from 'react';
import { Formik } from 'formik';

const SignIn = () => (
	<Formik
		initialValues={{ email: '' }}
		onSubmit={async (values) => {
			await new Promise((resolve) => setTimeout(resolve, 500));
			alert(JSON.stringify(values, null, 2));
		}}
		handleChange={(value) => {
			console.log(value);
		}}
		validate={(values) => {
			const errors = {};
			if (!values.email) {
				errors.email = 'Required';
			} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
				errors.email = 'Invalid email address';
			}
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

					<input type="password" name="password" onChange={handleChange} onBlur={handleBlur} value={values.password} />
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

export default SignIn;
