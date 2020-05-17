import React, { Component } from 'react';
import { Formik } from 'formik';
import Form from './Form';

class InputForm extends Component {
	state = {};
	render() {
		const { validationSchema, values, onSubmit } = this.props;
		return (
			<div>
				<Formik
					initialValues={values}
					onSubmit={onSubmit}
					validationSchema={validationSchema}
					render={(props) => <Form {...props} />}
				/>
			</div>
		);
	}
}

export default InputForm;
