import React, { Component } from 'react';
import { Formik } from 'formik';
import Form from './Form';

class InputForm extends Component {
	state = {};
	render() {
		const { validationSchema, inputs, onSubmit, errMsg } = this.props;
		const initialValues = {};
		inputs.forEach(({ name, value }) => {
			initialValues[name] = value ? value : '';
		});

		return (
			<div>
				<Formik
					initialValues={initialValues}
					onSubmit={onSubmit}
					validationSchema={validationSchema}
					render={(props) => <Form {...props} errMsg={errMsg} inputs={inputs} />}
				/>
			</div>
		);
	}
}

export default InputForm;
