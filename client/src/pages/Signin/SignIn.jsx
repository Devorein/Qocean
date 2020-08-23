import React from 'react';
import { useMutation } from '@apollo/react-components';
import { withRouter } from 'react-router-dom';
import * as Yup from 'yup';

import InputForm from '../../components/Form/InputForm';
import CustomSnackbars from '../../components/Snackbars/CustomSnackbars';
import Operations from '../../operations/Operations';

import './Signin.scss';

const validationSchema = Yup.object({
	email: Yup.string('Enter your email').email('Enter a valid email').required('Email is required'),
	password: Yup.string('Enter your password').required('Password is required')
});

function SignIn (props) {
	const [ signin ] = useMutation(Operations.Login_ObjectsNone);
	return (
		<CustomSnackbars>
			{({ changeResponse }) => {
				return (
					<div className="signin">
						<InputForm
							onSubmit={({ email, password }, { setSubmitting }) => {
								signin({
									variables: {
										data: {
											email,
											password
										}
									}
								})
									.then(({ data }) => {
										localStorage.setItem('token', data.login.token);
										changeResponse('Success', 'Successfully signed in', 'success');
										setTimeout(() => {
											props.history.push('/');
											props.refetch();
										}, 2500);
									})
									.catch((error) => {
										setSubmitting(false);
										changeResponse('An error occurred', error.message, 'error');
									});
							}}
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
export default withRouter(SignIn);
