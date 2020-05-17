import React, { Component } from 'react';
import { Formik } from 'formik';
import Form from './Form';

class InputForm extends Component {
	state = {};
	render() {
		const { validationSchema, values, onSubmit, errMsg } = this.props;
		return (
			<div>
				<Formik
					initialValues={values}
					onSubmit={onSubmit}
					validationSchema={validationSchema}
					render={(props) => <Form {...props} errMsg={errMsg} />}
				/>
			</div>
		);
	}
}

export default InputForm;
