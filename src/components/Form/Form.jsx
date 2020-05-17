import React, { Component, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import './Form.scss';

const useStyles = makeStyles({
	textField: {
		borderRadius: 3,
		border: 0,
		'& .MuiInputLabel-root': {
			fontFamily: 'Quantico',
			color: '#ccc',
			opacity: '0.5'
		},
		'& .MuiInputBase-input': {
			fontFamily: 'Quantico',
			color: '#eee'
		},
		'& .MuiFormHelperText-root': {
			color: '#f44336d6',
			fontWeight: 'bold',
			fontFamily: 'Quantico'
		}
	},
	button: {
		'& .MuiButton-label': {
			color: '#ddd',
			fontWeight: 'bold'
		},
		'&.Mui-disabled': {
			backgroundColor: '#c10000'
		}
	}
});

const Form = (props) => {
	const {
		values,
		errors,
		touched,
		handleSubmit,
		handleChange,
		handleBlur,
		isValid,
		setFieldTouched,
		isSubmitting,
		errMsg,
		submitMsg
	} = props;
	const { textField, button } = useStyles();

	const change = (name, e) => {
		e.persist();
		handleChange(e);
		setFieldTouched(name, true, false);
	};

	const formikProps = (name, initialValue = '') => ({
		name: name,
		value: typeof values[name] !== 'undefined' ? values[name] : initialValue,
		onChange: change.bind(null, name),
		onBlur: handleBlur,
		error: touched[name] && Boolean(errors[name]),
		helperText: touched[name] ? errors[name] : '',
		label: name
	});

	return (
		<form className="form" onSubmit={handleSubmit}>
			{Object.keys(values).map((value) => {
				return (
					<TextField
						classes={{
							root: textField
						}}
						key={value}
						type={value.includes('password') ? 'password' : 'text'}
						{...formikProps(value)}
						fullWidth
					/>
				);
			})}
			<div className="messages">
				<Button
					classes={{ root: button }}
					type="submit"
					variant="contained"
					color="primary"
					disabled={isSubmitting || !isValid}
				>
					{submitMsg ? submitMsg : 'Submit'}
				</Button>
				<div className={`response-box ${errMsg ? 'response-box--error' : ''}`}>{errMsg ? errMsg : 'None'}</div>
			</div>
		</form>
	);
};

export default Form;
