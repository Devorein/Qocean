import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import InputForm from '../../components/Form/InputForm';
import * as Yup from 'yup';
import { isStrongPassword, isAlphaNumericOnly } from '../../Utils/validation';
import FileInput from '../../RP/FileInput';
import { AppContext } from '../../context/AppContext';
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

class SignIn extends Component {
	static contextType = AppContext;

	postSubmit = (_id, image, file) => {
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
	};

	submitForm = (getFileData, values, { setSubmitting }) => {
		const { name, email, username, password } = values;
		const { file, src, image } = getFileData();
		if (image === 'link') values.image = src;
		axios
			.post(`http://localhost:5001/api/v1/auth/register`, {
				name,
				email,
				username,
				password
			})
			.then(({ data: { _id, token } }) => {
				localStorage.setItem('token', token);
				this.props.history.push('/');
				this.postSubmit(_id, image, file);
				this.changeResponse(`Success`, 'Successfully signed up', 'success');
			})
			.catch((err) => {
				this.changeResponse(`An error occurred`, err.response.data.error, 'error');
				setTimeout(() => {
					setSubmitting(false);
				}, 2500);
			});
	};

	render() {
		return (
			<CustomSnackbars>
				{({ changeResponse }) => {
					this.changeResponse = changeResponse;
					return (
						<FileInput src="">
							{({ FileInput, getFileData }) => {
								return (
									<div className="signup pages">
										<InputForm
											onSubmit={this.submitForm.bind(null, getFileData)}
											validationSchema={validationSchema}
											inputs={[
												{ name: 'name', startAdornment: 'person' },
												{ name: 'username', startAdornment: 'person' },
												{ name: 'email', startAdornment: 'email' },
												{ name: 'password' },
												{ name: 'confirm_password' }
											]}
										/>
										{FileInput}
									</div>
								);
							}}
						</FileInput>
					);
				}}
			</CustomSnackbars>
		);
	}
}

export default withRouter(SignIn);
