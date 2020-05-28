import React, { Component } from 'react';
import InputForm from '../../components/Form/InputForm';
import * as Yup from 'yup';
import axios from 'axios';
import { isAlphaNumericOnly } from '../../Utils/validation';
import { withRouter } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import GenericButton from '../../components/Buttons/GenericButton';
import TextField from '@material-ui/core/TextField';
import ModalRP from '../../RP/ModalRP';
import ExportAll from './ExportAll';

class Profile extends Component {
	state = {
		password: ''
	};
	static contextType = AppContext;

	submitForm = ({ name, email, username, image, password }, { setSubmitting }) => {
		const { user } = this.props;
		const payload = {};
		payload.name = name ? name : user.name;
		payload.email = email ? email : user.email;
		payload.username = username ? username : user.username;
		payload.image = image ? image : user.image;
		const headers = {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		};

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
						localStorage.removeItem('token');
						this.props.history.push('/signin');
						this.props.refetch();
						this.context.changeResponse('Success', 'Successfully updated profile', 'success');
					})
					.catch((err) => {
						setTimeout(() => {
							setSubmitting(false);
						}, 2500);
						this.context.changeResponse(err.response.data.error, 'error');
					});
			})
			.catch((err) => {
				this.context.changeResponse('An error occurred', err.response.data.error, 'error');
				setTimeout(() => {
					setSubmitting(false);
				}, 2500);
			});
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
						headers: {
							Authorization: `Bearer ${localStorage.getItem('token')}`
						}
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
				customHandler={({ password }) => {
					this.setState({
						password
					});
				}}
				onSubmit={this.checkPassword}
				inputs={[ { type: 'password', defaultValue: '', name: 'password' } ]}
			/>
		);
	};
	render() {
		const { user } = this.props;

		const inputs = [
			{ name: 'name', startAdornment: 'person', defaultValue: user.name },
			{ name: 'username', startAdornment: 'person', defaultValue: user.username },
			{ name: 'email', startAdornment: 'email', defaultValue: user.email },
			{
				name: 'image',
				startAdornment: 'image',
				defaultValue: user.image
			},
			{ name: 'password', type: 'password' }
		];

		const validationSchema = Yup.object({
			name: Yup.string('Enter a name').default(user.name),
			username: Yup.string('Enter a username')
				.min(3, 'Username mustbe atleast 3 characters long')
				.max(10, 'Username cannot be more than 10 characters long')
				.test('isAlphaNumericOnly', 'Username should be alphanumeric only', isAlphaNumericOnly)
				.default(user.username),
			email: Yup.string('Enter your email').email('Enter a valid email').default(user.email),
			image: Yup.string('Enter your profile image').default(user.image)
		});

		return (
			<ModalRP onClose={(e) => {}} onAccept={() => {}} modalMsg={this.renderPassword()}>
				{({ setIsOpen }) => (
					<div className="profile pages">
						<InputForm
							validationSchema={validationSchema}
							inputs={inputs}
							onSubmit={this.submitForm}
							submitMsg={'update'}
						/>
						<GenericButton text="Delete account" onClick={(e) => setIsOpen(true)} />
						<ExportAll />
					</div>
				)}
			</ModalRP>
		);
	}
}

export default withRouter(Profile);
