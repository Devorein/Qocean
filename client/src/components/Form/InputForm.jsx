import React, { Component, Fragment } from 'react';
import { Formik } from 'formik';
import Form from './Form';

class InputForm extends Component {
	populateInitialValue = (inputs, { validateOnChange, validationSchema }) => {
		const initialValues = {};
		const initialErrors = {};

		function inner (input, parents = [], index) {
			const full_key = parents.reduce((acc, parent) => acc.concat(parent.name), []).join('.');
			const parent = parents[parents.length - 1] || {};
			const { extra = {} } = parent;
			if (input.type === 'group') input.children.forEach((child, index) => inner(child, [ ...parents, input ], index));
			else {
				const { name, defaultValue } = input;
				const field_key = `${full_key && extra.append ? full_key + '$' : ''}` + (extra.useIndex ? index : name);
				input.name = field_key;
				initialValues[field_key] = typeof defaultValue !== 'undefined' ? defaultValue : '';
				try {
					if (validateOnChange && validationSchema._nodes.includes(field_key))
						validationSchema.validateSyncAt(field_key, initialValues[field_key], { abortEarly: true });
				} catch (err) {
					initialErrors[field_key] = err.message;
				}
			}
		}
		inputs.forEach((input) => (input ? inner(input, [], 0) : void 0));

		return { initialValues, initialErrors };
	};
	render () {
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
			disabled
		} = this.props;

		const { initialValues, initialErrors } = this.populateInitialValue(inputs, this.props);
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
