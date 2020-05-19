import React, { Fragment } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import FormLabel from '@material-ui/core/FormLabel';
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

		'& .MuiSvgIcon-root': {
			fill: '#aaa'
		}
	},
	formcontrollabel: {
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
	const { textField, formcontrollabel } = useStyles();

	const change = (name, e) => {
		e.persist();
		handleChange(e);
		setFieldTouched(name, true, false);
	};

	const decideLabel = (name, label) => {
		if (label) return label;
		else return name.split('_').map((name) => name.charAt(0).toUpperCase() + name.substr(1)).join(' ');
	};

	const decideValue = (type, name, defaultValue, initialValue) => {
		if (values[name] === '') {
			if (type === 'select' || type === 'number') return defaultValue;
			else if (type === 'text' || type === 'password') return initialValue;
		} else return values[name];
	};

	const formikProps = (type, name, label, placeholder, initialValue, defaultValue) => {
		return {
			name,
			value: decideValue(type, name, defaultValue, initialValue),
			onChange: change.bind(null, name),
			onBlur: handleBlur,
			error: touched[name] && Boolean(errors[name]),
			helperText: touched[name] ? errors[name] : '',
			label: decideLabel(name, label),
			placeholder
		};
	};

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
					selectItems,
					radioItems,
					inputProps,
					helperText,
					disabled
				}) => {
					if (type === 'select')
						return (
							<FormControl disabled={disabled ? disabled : false} fullWidth key={name}>
								{!disabled ? (
									<Fragment>
										<InputLabel id={name}>{decideLabel(name, label)}</InputLabel>
										<Select
											name={name}
											value={decideValue(type, name, defaultValue ? defaultValue : '')}
											onChange={change.bind(null, name)}
										>
											{selectItems.map(({ value, text }) => {
												return (
													<MenuItem key={value} value={value}>
														{text}
													</MenuItem>
												);
											})}
										</Select>
									</Fragment>
								) : null}
								{helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
							</FormControl>
						);
					else if (type === 'checkbox')
						return (
							<FormControlLabel
								key={name}
								classes={{ label: formcontrollabel }}
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
								label={decideLabel(name, label)}
							/>
						);
					else if (type === 'radio')
						return (
							<FormControl key={name}>
								<FormLabel component="legend">{decideLabel(name, label)}</FormLabel>
								<RadioGroup row aria-label={name} name={name} defaultValue={defaultValue}>
									{radioItems.map(({ label, value }) => (
										<FormControlLabel
											value={value}
											key={value}
											classes={{ label: formcontrollabel }}
											control={<Radio color="primary" />}
											label={label}
											labelPlacement="end"
										/>
									))}
								</RadioGroup>
							</FormControl>
						);
					else if (type === 'number')
						return (
							<TextField
								classes={{
									root: textField
								}}
								key={name}
								type={'number'}
								{...formikProps('number', name, label, placeholder, value, defaultValue)}
								fullWidth
								inputProps={{ ...inputProps }}
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
			<Button type="submit" variant="contained" color="primary" disabled={isSubmitting || !isValid}>
				{submitMsg ? submitMsg : 'Submit'}
			</Button>
		</form>
	);
};

export default Form;
