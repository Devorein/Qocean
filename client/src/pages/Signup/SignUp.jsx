import React from 'react';
import { useMutation } from '@apollo/react-components';
import { withRouter } from 'react-router-dom';
import * as Yup from 'yup';

import Operations from '../../operations/Operations';
import InputForm from '../../components/Form/InputForm';
import { isStrongPassword, isAlphaNumericOnly } from '../../Utils/validation';
import FileInput from '../../RP/FileInput';
import CustomSnackbars from '../../components/Snackbars/CustomSnackbars';

import './Signup.scss';

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

const FormInput = [
	{ name: 'name', startAdornment: 'person' },
	{ name: 'username', startAdornment: 'person' },
	{ name: 'email', startAdornment: 'email' },
	{ name: 'password' },
	{ name: 'confirm_password' }
];

function SignIn ({ history, refetch }) {
	const [ register ] = useMutation(Operations.Register_ObjectsNone);
	const GLOBAL = {};
	/* const postSubmit = (_id, image, file) => {
		const fd = new FormData();
		if (image === 'upload' && file) {
			fd.append('file', file, file.name);
			axios
				.put(`http://localhost:5001/api/v1/users/${_id}/photo`, fd, {
					headers: {
						'Content-Type': 'multipart/form-data',
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				})
				.then((data) => {
					setTimeout(() => {
						this.changeResponse(`Uploaded`, `Successsfully uploaded image for the user`, 'success');
						this.props.refetch();
					}, 500);
				})
				.catch((err) => {
					setTimeout(() => {
						this.changeResponse(`An error occurred`, err.response.data.error, 'error');
					}, 500);
				});
		} else this.props.refetch();
	}; */

	const onSubmit = (values, { setSubmitting }) => {
		const { name, email, username, password } = values;
		const { src, image } = GLOBAL.FileInputState;
		if (image === 'link') values.image = src;
		register({
			variables: {
				data: {
					name,
					email,
					username,
					password
				}
			}
		})
			.then(({ data }) => {
				localStorage.setItem('token', data.register.token);
				history.push('/');
				// postSubmit(_id, image, file);
				GLOBAL.changeResponse(`Success`, 'Successfully signed up', 'success');
				refetch();
			})
			.catch((error) => {
				GLOBAL.changeResponse(`An error occurred`, error.message, 'error');
				setTimeout(() => {
					setSubmitting(false);
				}, 2500);
			});
	};

	return (
		<CustomSnackbars>
			{({ changeResponse }) => {
				GLOBAL.changeResponse = changeResponse;
				return (
					<FileInput src="">
						{({ FileInput: FileInputComp, FileInputState }) => {
							GLOBAL.FileInputState = FileInputState;
							return (
								<div className="signup pages">
									<InputForm onSubmit={onSubmit} validationSchema={validationSchema} inputs={FormInput} />
									{FileInputComp}
								</div>
							);
						}}
					</FileInput>
				);
			}}
		</CustomSnackbars>
	);
}

export default withRouter(SignIn);
