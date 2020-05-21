import React, { Component } from 'react';
import { Formik } from 'formik';
import Form from './Form';

class InputForm extends Component {
	render() {
		const { validationSchema, inputs, onSubmit, customHandler, formButtons, classNames, validateOnMount } = this.props;
		const initialValues = {};
		inputs.forEach((input) => {
			if (input) {
				const { name, defaultValue, type, children } = input;
				if (type === 'group')
					children.forEach(
						({ name, defaultValue }) => (initialValues[name] = typeof defaultValue !== 'undefined' ? defaultValue : '')
					);
				else initialValues[name] = typeof defaultValue !== 'undefined' ? defaultValue : '';
			}
		});

		return (
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				validationSchema={validationSchema}
				validateOnMount={validateOnMount ? validateOnMount : false}
			>
				{(props) => {
					return (
						<Form
							{...props}
							classNames={classNames}
							inputs={inputs}
							customHandler={customHandler}
							formButtons={formButtons}
						>
							{this.props.children}
						</Form>
					);
				}}
			</Formik>
		);
	}
}

export default InputForm;
