import React, { Component } from 'react';
import { Formik } from 'formik';
import Form from './Form';

class InputForm extends Component {
	state = {};
	render() {
		const { validationSchema, inputs, onSubmit, responseMsg } = this.props;
		const initialValues = {};
		inputs.forEach(({ name, value }) => {
			initialValues[name] = value ? value : '';
		});

		return (
			<div>
				<Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
					{(props) => <Form {...props} responseMsg={responseMsg} inputs={inputs} />}
				</Formik>
			</div>
		);
	}
}

export default InputForm;
