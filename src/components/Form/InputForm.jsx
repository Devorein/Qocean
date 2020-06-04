import React, { Component, Fragment } from 'react';
import { Formik } from 'formik';
import Form from './Form';

class InputForm extends Component {
	render() {
		const {
			validationSchema,
			inputs,
			onSubmit,
			customHandler,
			formButtons,
			classNames,
			validateOnMount = false,
			errorBeforeTouched = false,
			submitMsg,
			children,
			passFormAsProp = false,
			initialTouched,
			validateOnChange = false,
			disabled
		} = this.props;
		const initialValues = {};
		let initialErrors = {};
		inputs.forEach((input) => {
			if (input) {
				const { name, defaultValue, extra = {}, type, children } = input;
				if (name) {
					if (type === 'group' && !extra.coalesce)
						children.forEach(({ name, defaultValue }) => {
							initialValues[name] = typeof defaultValue !== 'undefined' ? defaultValue : '';
							try {
								if (validateOnChange && validationSchema._nodes.includes(name))
									validationSchema.validateSyncAt(name, initialValues[name], { abortEarly: true });
							} catch (err) {
								initialErrors[name] = err.message;
							}
						});
					else if (type === 'group' && extra.coalesce) {
						const groupname = input.name;
						if (extra.useArray) initialValues[groupname] = [];
						else initialValues[groupname] = {};
						children.forEach(({ name, defaultValue }, index) => {
							const inputvalue = typeof defaultValue !== 'undefined' ? defaultValue : '';
							if (extra.useArray) initialValues[groupname][index] = inputvalue;
							else initialValues[groupname][name] = inputvalue;
						});
						try {
							if (validateOnChange && validationSchema._nodes.includes(groupname))
								validationSchema.validateSyncAt(groupname, initialValues[groupname], { abortEarly: true });
						} catch (err) {
							initialErrors[groupname] = err.message;
						}
					} else {
						initialValues[name] = typeof defaultValue !== 'undefined' ? defaultValue : '';
						try {
							if (validateOnChange && validationSchema._nodes.includes(name))
								validationSchema.validateSyncAt(name, initialValues[name], { abortEarly: true });
						} catch (err) {
							initialErrors[name] = err.message;
						}
					}
				}
			}
		});
		return (
			<Formik
				initialValues={initialValues}
				onSubmit={onSubmit}
				validationSchema={validationSchema}
				validateOnMount={validateOnMount}
				enableReinitialize={true}
				initialTouched={initialTouched ? initialTouched : {}}
				initialErrors={initialErrors}
			>
				{(props) => {
					const FORM = (
						<Form
							{...props}
							classNames={classNames}
							inputs={inputs}
							customHandler={customHandler}
							formButtons={formButtons}
							errorBeforeTouched={errorBeforeTouched}
							submitMsg={submitMsg}
							disabled={disabled}
						/>
					);
					return (
						<Fragment>
							{passFormAsProp ? null : FORM}
							{children && typeof children === 'function' ? (
								children({
									setValues: props.setValues,
									values: props.values,
									errors: props.errors,
									isValid: props.isValid,
									resetForm: props.resetForm,
									inputs: passFormAsProp ? FORM : null
								})
							) : (
								children
							)}
						</Fragment>
					);
				}}
			</Formik>
		);
	}
}

export default InputForm;
