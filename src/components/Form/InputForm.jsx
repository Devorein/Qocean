import React, { Component } from 'react';
import { Formik } from 'formik';
import Form from './Form';

class InputForm extends Component {
	render() {
		const { validationSchema, inputs, onSubmit } = this.props;
		const initialValues = {};
		inputs.forEach(({ name, defaultValue }) => {
			initialValues[name] = typeof defaultValue !== 'undefined' ? defaultValue : '';
		});
		return (
			<div>
				<Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
					{(props) => <Form {...props} inputs={inputs} />}
				</Formik>
			</div>
		);
	}
}

export default InputForm;
