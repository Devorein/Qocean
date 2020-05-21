import React, { Component } from 'react';
import InputForm from '../../components/Form/InputForm';
import * as Yup from 'yup';
import axios from 'axios';
import { isAlphaNumericOnly } from '../../Utils/validation';
import { withRouter } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

const inputs = [
	{ name: 'name', startAdornment: 'person' },
	{ name: 'username', startAdornment: 'person' },
	{ name: 'email', startAdornment: 'email' },
	{
		name: 'image',
		startAdornment: 'image'
	}
];

class Profile extends Component {
	submitForm = (changeResponse, { name, email, username, image }, { setSubmitting }) => {
		const { user } = this.props;
		const payload = {};
		payload.name = name ? name : user.name;
		payload.email = email ? email : user.email;
		payload.username = username ? username : user.username;
		payload.image = image ? image : user.image;
		axios
			.put(`http://localhost:5001/api/v1/users/updateDetails`, payload, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			})
			.then((res) => {
				localStorage.removeItem('token');
				this.props.history.push('/');
				this.props.refetch();
			})
			.catch((err) => {
				setTimeout(() => {
					setSubmitting(false);
				}, 2500);
				changeResponse(err.response.data.error, 'error');
			});
	};

	render() {
		const { user } = this.props;

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
			<AppContext.Consumer>
				{({ changeResponse }) => {
					return (
						<div className="profile pages">
							<InputForm
								validationSchema={validationSchema}
								inputs={inputs}
								onSubmit={this.submitForm.bind(null, changeResponse)}
								responseMsg={{}}
							/>
						</div>
					);
				}}
			</AppContext.Consumer>
		);
	}
}

export default withRouter(Profile);
