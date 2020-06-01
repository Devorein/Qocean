import React, { Component } from 'react';
import InputForm from '../../components/Form/InputForm';
import * as Yup from 'yup';
import axios from 'axios';
import { isAlphaNumericOnly } from '../../Utils/validation';
import { withRouter } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import GenericButton from '../../components/Buttons/GenericButton';
import ModalRP from '../../RP/ModalRP';
import ExportAll from './ExportAll';
import FileInputRP from '../../RP/FileInputRP';
import ChangePassword from '../../RP/ChangePassword';
import './Profile.scss';

class Profile extends Component {
	state = {
		password: '',
		newPassword: false
	};

	static contextType = AppContext;

	postSubmit = (image, file) => {
		const fd = new FormData();
		if (image === 'upload' && file) {
			fd.append('file', file, file.name);
			axios
				.put(`http://localhost:5001/api/v1/users/${this.props.user._id}/photo`, fd, {
					headers: {
						'Content-Type': 'multipart/form-data',
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				})
				.then((data) => {
					setTimeout(() => {
						this.props.changeResponse(`Uploaded`, `Successsfully uploaded image for the user`, 'success');
					}, this.props.user.current_environment.notification_timing + 500);
				})
				.catch((err) => {
					setTimeout(() => {
						this.props.changeResponse(`An error occurred`, err.response.data.error, 'error');
					}, this.props.user.current_environment.notification_timing + 500);
				});
		}
	};

	submitForm = (
		getFileData,
		{ showChangePasswordForm, values, errors, isValid, password: current_password },
		{ name, email, username },
		{ setSubmitting }
	) => {
		const updateUser = (password) => {
			axios
				.get(`http://localhost:5001/api/v1/auth/checkpassword/${password ? password : '_'}`, {
					...headers
				})
				.then(() => {
					axios
						.put(`http://localhost:5001/api/v1/users/updateDetails`, payload, {
							...headers
						})
						.then((res) => {
							this.context.changeResponse('Success', 'Successfully updated profile', 'success');
							setTimeout(() => {
								setSubmitting(false);
							}, 2500);
							this.props.refetch();
							this.postSubmit(image, file);
						})
						.catch((err) => {
							this.context.changeResponse('An error occurred', err.response.data.error, 'error');
							setTimeout(() => {
								setSubmitting(false);
							}, 2500);
						});
				})
				.catch((err) => {
					this.context.changeResponse('An error occurred', err.response.data.error, 'error');
					setTimeout(() => {
						setSubmitting(false);
					}, 2500);
				});
		};

		const { user } = this.props;
		const payload = {};
		const { file, src, image } = getFileData();
		if (image === 'link' || (image === 'upload' && !file)) payload.image = src;
		payload.name = name ? name : user.name;
		payload.email = email ? email : user.email;
		payload.username = username ? username : user.username;

		const headers = {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		};

		if (showChangePasswordForm && !isValid) {
			this.context.changeResponse('Error', errors[Object.keys(errors)[0]], 'error');
			setTimeout(() => {
				setSubmitting(false);
			}, 2500);
		} else if (showChangePasswordForm && isValid) {
			axios
				.put(
					`http://localhost:5001/api/v1/users/updatepassword`,
					{
						currentPassword: current_password,
						newPassword: values.new_password
					},
					{ ...headers }
				)
				.then((data) => {
					this.context.changeResponse('Success', 'Successfully updated password', 'success');
					setTimeout(() => {
						setSubmitting(false);
					}, 2500);
					updateUser(values.new_password);
				});
		} else updateUser(current_password);
	};

	checkPassword = (values, { setSubmitting }) => {
		const headers = {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		};

		axios
			.get(`http://localhost:5001/api/v1/auth/checkpassword/${this.state.password ? this.state.password : '_'}`, {
				...headers
			})
			.then((data) => {
				axios
					.delete(`http://localhost:5001/api/v1/users`, {
						...headers
					})
					.then(() => {
						localStorage.removeItem('token');
						this.props.history.push('/signup');
						this.props.refetch();
						this.context.changeResponse('Success', 'Successfully delete your account', 'success');
					});
				setSubmitting(false);
			})
			.catch((err) => {
				this.context.changeResponse('Invalid credentials', 'You provided the wrong password', 'error');
				setTimeout(() => {
					setSubmitting(false);
				}, 2500);
			});
	};

	renderPassword = () => {
		return (
			<InputForm
				submitMsg="Delete"
				onSubmit={this.checkPassword}
				inputs={[
					{
						type: 'password',
						defaultValue: '',
						name: 'password',
						fieldHandler: (password) => {
							this.setState({
								password
							});
						}
					}
				]}
			/>
		);
	};

	decideImage = () => {
		const { user: { image } } = this.props;
		return image && image.startsWith('http') ? image : `http://localhost:5001/uploads/${image}`;
	};
	render() {
		const { decideImage } = this;
		const { user } = this.props;

		const formInputs = [
			{ name: 'name', startAdornment: 'person', defaultValue: user.name },
			{ name: 'username', startAdornment: 'person', defaultValue: user.username },
			{ name: 'email', startAdornment: 'email', defaultValue: user.email },
			null
		];

		const validationSchema = Yup.object({
			name: Yup.string('Enter a name').default(user.name),
			username: Yup.string('Enter a username')
				.min(3, 'Username mustbe atleast 3 characters long')
				.max(10, 'Username cannot be more than 10 characters long')
				.test('isAlphaNumericOnly', 'Username should be alphanumeric only', isAlphaNumericOnly)
				.default(user.username),
			email: Yup.string('Enter your email').email('Enter a valid email').default(user.email)
		});

		return (
			<FileInputRP src={decideImage()}>
				{({ FileInput, getFileData }) => {
					return (
						<ModalRP onClose={(e) => {}} onAccept={() => {}} modalMsg={this.renderPassword()}>
							{({ setIsOpen }) => (
								<ChangePassword>
									{({ formData, inputs, button, passwordInput, disabled }) => {
										formInputs[3] = passwordInput;
										return (
											<div className="profile pages">
												<InputForm
													classNames={'profile_form'}
													validationSchema={validationSchema}
													inputs={formInputs}
													onSubmit={this.submitForm.bind(null, getFileData, formData)}
													submitMsg={'update'}
													disabled={disabled}
												/>
												{inputs}
												<div className="profile_buttons">
													{button}
													<GenericButton text="Delete account" onClick={(e) => setIsOpen(true)} />
													<ExportAll />
												</div>
												{FileInput}
											</div>
										);
									}}
								</ChangePassword>
							)}
						</ModalRP>
					);
				}}
			</FileInputRP>
		);
	}
}

export default withRouter(Profile);
