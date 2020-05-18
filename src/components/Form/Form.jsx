import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';

import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import EmailIcon from '@material-ui/icons/Email';
import PersonIcon from '@material-ui/icons/Person';
import ImageIcon from '@material-ui/icons/Image';

import './Form.scss';

const useStyles = makeStyles({
	textField: {
		borderRadius: 3,
		border: 0,
		margin: '5px',
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
		},
		'& .MuiSvgIcon-root': {
			fill: '#aaa'
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
	},
	formlabel: {
		fontFamily: 'Quantico',
		color: '#ddd'
	}
});

const Form = (props) => {
	const [ state, setState ] = React.useState({
		showPassword: false
	});

	const handleClickShowPassword = () => {
		setState({ ...state, showPassword: !state.showPassword });
	};

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
		submitMsg,
		inputs
	} = props;
	const { textField, button, formlabel } = useStyles();

	const change = (name, e) => {
		e.persist();
		handleChange(e);
		setFieldTouched(name, true, false);
	};

	const decideLabel = (label, name) => {
		if (label) return label;
		else return name.split('_').map((name) => name.charAt(0).toUpperCase() + name.substr(1)).join(' ');
	};

	const formikProps = (type = '', name, label, placeholder, initialValue = '', defaultValue = '') => ({
		name,
		value: type === 'select' ? defaultValue : typeof values[name] !== 'undefined' ? values[name] : initialValue,
		onChange: change.bind(null, name),
		onBlur: handleBlur,
		error: touched[name] && Boolean(errors[name]),
		helperText: touched[name] ? errors[name] : '',
		label: decideLabel(label, name),
		placeholder
	});

	const decideIcon = (icon) => {
		if (icon === 'email') return <EmailIcon />;
		else if (icon === 'person') return <PersonIcon />;
		else if (icon === 'image') return <ImageIcon />;
	};

	const decideAdornment = (InputProps, startAdornment, endAdornment) => {
		if (InputProps) return InputProps;
		else if (startAdornment) {
			return {
				startAdornment: <InputAdornment position="start">{decideIcon(startAdornment)}</InputAdornment>
			};
		} else if (endAdornment) {
			return {
				endAdornment: <InputAdornment position="end">{decideIcon(endAdornment)}</InputAdornment>
			};
		}
	};
	return (
		<form className="form" onSubmit={handleSubmit}>
			{inputs.map(
				({
					name,
					label,
					placeholder,
					defaultValue,
					value,
					InputProps,
					startAdornment,
					endAdornment,
					type,
					selectItems
				}) => {
					if (type === 'select') {
						return (
							<TextField
								classes={{
									root: textField
								}}
								key={name}
								select
								{...formikProps(type, name, label, placeholder, value, defaultValue)}
								fullWidth
							>
								{selectItems.map(({ value, text }) => {
									return (
										<MenuItem key={value} value={value}>
											{text}
										</MenuItem>
									);
								})}
							</TextField>
						);
					} else if (type === 'checkbox')
						return (
							<FormControlLabel
								key={name}
								classes={{ label: formlabel }}
								control={
									<Checkbox
										color={'primary'}
										checked={Boolean(values[name])}
										name={name}
										onChange={change.bind(null, name)}
										onBlur={handleBlur}
										error={touched[name] && errors[name]}
									/>
								}
								label={label}
							/>
						);
					else
						return name.toLowerCase().includes('password') ? (
							<TextField
								classes={{
									root: textField
								}}
								key={name}
								type={state.showPassword ? 'text' : 'password'}
								{...formikProps('text', name, label, placeholder, value)}
								fullWidth
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword}>
												{state.showPassword ? <Visibility /> : <VisibilityOff />}
											</IconButton>
										</InputAdornment>
									)
								}}
							/>
						) : (
							<TextField
								classes={{
									root: textField
								}}
								key={name}
								type={'text'}
								{...formikProps('text', name, label, placeholder, value)}
								fullWidth
								InputProps={decideAdornment(InputProps, startAdornment, endAdornment)}
							/>
						);
				}
			)}
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
			</div>
		</form>
	);
};

export default Form;
