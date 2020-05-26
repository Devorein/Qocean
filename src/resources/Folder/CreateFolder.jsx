import React, { Component, Fragment } from 'react';

import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import FormHelperText from '@material-ui/core/FormHelperText';
import MultiSelect from '../../components/MultiSelect/MultiSelect';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Icon from '@material-ui/core/Icon';
import getColoredIcons from '../../Utils/getColoredIcons';
import { AppContext } from '../../context/AppContext';

const validationSchema = Yup.object({
	name: Yup.string('Enter folder name').required('Folder name is required'),
	icon: Yup.string('Enter folder icon'),
	favourite: Yup.bool().default(false),
	public: Yup.bool().default(true)
});

class CreateFolder extends Component {
	state = {
		folders: [],
		loading: true,
		selected_quizzes: [],
		quizzes: []
	};

	static contextType = AppContext;

	decideLabel = (name, label) => {
		if (label) return label;
		else return name.split('_').map((name) => name.charAt(0).toUpperCase() + name.substr(1)).join(' ');
	};

	componentDidMount() {
		axios
			.get('http://localhost:5001/api/v1/quizzes/me?select=name&populate=false', {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			})
			.then(({ data: { data: quizzes } }) => {
				this.setState({
					quizzes,
					loading: false
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}

	selectQuizzes = (e) => {
		this.setState({
			selected_quizzes: e.target.value
		});
	};

	render() {
		const { selectQuizzes } = this;
		const { quizzes, loading, selected_quizzes } = this.state;
		const initialValues = this.props.initialValues
			? this.props.initialValues
			: { name: '', public: true, favourite: false, icon: 'Red_folder.svg' };
		return (
			<div className="create_folder create_form">
				<Formik
					initialValues={initialValues}
					validationSchema={validationSchema}
					enableReinitialize={true}
					onSubmit={this.context.submitForm.bind(null, [ 'folder' ])}
				>
					{({
						isSubmitting,
						isValid,
						handleBlur,
						touched,
						errors,
						values,
						handleChange,
						setFieldTouched,
						handleSubmit
					}) => {
						const formikProps = (name, label, placeholder) => {
							return {
								name,
								value: values[name],
								onChange: (e) => {
									e.persist();
									handleChange(e);
									setFieldTouched(name, true, false);
								},
								onBlur: handleBlur,
								error: touched[name] && Boolean(errors[name]),
								helperText: touched[name] ? errors[name] : '',
								label: this.decideLabel(name, label),
								placeholder
							};
						};
						return (
							<form onSubmit={handleSubmit}>
								<TextField type={'text'} {...formikProps('name')} fullWidth name={'name'} />
								<FormControlLabel
									control={
										<Checkbox
											color={'primary'}
											checked={values['favourite'] === true ? true : false}
											name={'favourite'}
											onChange={(e) => {
												e.persist();
												handleChange(e);
												setFieldTouched('favourite', true, false);
											}}
											onBlur={handleBlur}
											error={touched['favourite'] && errors['favourite']}
										/>
									}
									label={this.decideLabel('favourite')}
								/>
								<FormControlLabel
									control={
										<Checkbox
											color={'primary'}
											checked={values['public'] === true ? true : false}
											name={'public'}
											onChange={(e) => {
												e.persist();
												handleChange(e);
												setFieldTouched('public', true, false);
											}}
											onBlur={handleBlur}
											error={touched['public'] && errors['public']}
										/>
									}
									label={this.decideLabel('public')}
								/>
								<Fragment>
									<InputLabel id={'Icon'}>{this.decideLabel('icon')}</InputLabel>
									<Select
										name={'icon'}
										value={values['icon']}
										onChange={(e) => {
											e.persist();
											handleChange(e);
											setFieldTouched('icon', true, false);
										}}
									>
										{[ 'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'purple' ]
											.map((color) => {
												const capitalized = color.charAt(0).toUpperCase() + color.substr(1);
												return {
													text: capitalized,
													value: `${capitalized}_folder.svg`,
													icon: getColoredIcons('Folder', color)
												};
											})
											.map(({ value, text, icon }) => {
												return (
													<MenuItem key={value ? value : text} value={value ? value : text}>
														{icon ? <Icon>{icon}</Icon> : null}
														{text}
													</MenuItem>
												);
											})}
									</Select>
								</Fragment>
								{loading ? (
									<FormHelperText>Loading your quizzes</FormHelperText>
								) : quizzes.length < 1 ? (
									<FormHelperText>Loading your quizzes</FormHelperText>
								) : (
									<MultiSelect
										label={'Quizzes'}
										selected={selected_quizzes}
										handleChange={selectQuizzes}
										items={quizzes}
									/>
								)}
								<Button type="submit" variant="contained" color="primary" disabled={isSubmitting || !isValid}>
									{'Submit'}
								</Button>
							</form>
						);
					}}
				</Formik>
			</div>
		);
	}
}

export default CreateFolder;
