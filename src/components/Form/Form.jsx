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
import FormGroup from '@material-ui/core/FormGroup';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import EmailIcon from '@material-ui/icons/Email';
import PersonIcon from '@material-ui/icons/Person';
import ImageIcon from '@material-ui/icons/Image';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';
import CancelIcon from '@material-ui/icons/Cancel';

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
		inputs,
		children,
		resetMsg,
		resetForm,
		customHandler,
		formButtons = true,
		classNames
	} = props;
	const { textField, formcontrollabel } = useStyles();

	const decideLabel = (name, label) => {
		if (label) return label;
		else return name.split('_').map((name) => name.charAt(0).toUpperCase() + name.substr(1)).join(' ');
	};

	const change = (name, e) => {
		e.persist();
		if (customHandler) customHandler(e);
		handleChange(e);
		setFieldTouched(name, true, false);
	};

	const formikProps = (type, name, label, placeholder) => {
		return {
			name,
			value: values[name],
			onChange: change.bind(null, name),
			onBlur: handleBlur,
			error: touched[name] && Boolean(errors[name]),
			helperText: touched[name] ? errors[name] : '',
			label: decideLabel(name, label),
			placeholder
		};
	};

	const decideIcon = (icon, onClick) => {
		if (icon === 'email') return <EmailIcon onClick={onClick} />;
		else if (icon === 'person') return <PersonIcon onClick={onClick} />;
		else if (icon === 'image') return <ImageIcon onClick={onClick} />;
		else if (icon === 'close' || icon === 'cancel') return <CancelIcon onClick={onClick} />;
	};

	const decideAdornment = (name, InputProps, startAdornment, endAdornment) => {
		if (InputProps) return InputProps;
		else if (startAdornment) {
			return {
				startAdornment: <InputAdornment position="start">{decideIcon(startAdornment)}</InputAdornment>
			};
		} else if (endAdornment) {
			return {
				endAdornment: (
					<InputAdornment position="end">
						{decideIcon(endAdornment[0], endAdornment[1].bind(null, name))}
					</InputAdornment>
				)
			};
		}
	};
	return (
		<form className={`form${classNames ? ' ' + classNames : ''}`} onSubmit={handleSubmit}>
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
										<Select name={name} value={values[name]} onChange={change.bind(null, name)}>
											{selectItems.map(({ value, text, icon }) => {
												return (
													<MenuItem key={value ? value : text} value={value ? value : text}>
														{icon ? <Icon>{icon}</Icon> : null}
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
										checked={values[name] === true ? true : false}
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
					else if (type === 'textarea')
						return (
							<TextField
								key={name}
								type={'text'}
								multiline
								rows={10}
								defaultValue={defaultValue}
								{...formikProps('textarea', name, label, placeholder, value)}
								fullWidth
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
								InputProps={decideAdornment(name, InputProps, startAdornment, endAdornment)}
							/>
						);
				}
			)}
			{children}
			{formButtons ? (
				<FormGroup row={true}>
					<Button
						variant="contained"
						color="default"
						onClick={(e) => {
							resetForm();
						}}
					>
						{resetMsg ? resetMsg : 'Reset'}
					</Button>
					<Button type="submit" variant="contained" color="primary" disabled={isSubmitting || !isValid}>
						{submitMsg ? submitMsg : 'Submit'}
					</Button>
				</FormGroup>
			) : null}
		</form>
	);
};

export default Form;
