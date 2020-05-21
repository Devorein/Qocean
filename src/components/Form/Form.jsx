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
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import EmailIcon from '@material-ui/icons/Email';
import PersonIcon from '@material-ui/icons/Person';
import ImageIcon from '@material-ui/icons/Image';
import Icon from '@material-ui/core/Icon';
import CancelIcon from '@material-ui/icons/Cancel';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

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

	const formikProps = (name, label, placeholder, controlled, onChange, onkeyPress) => {
		if (controlled)
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
		else {
			return {
				name,
				onKeyPress: onkeyPress,
				label: decideLabel(name, label)
			};
		}
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

	const renderFormComponent = (input) => {
		const {
			name,
			label,
			placeholder,
			defaultValue,
			InputProps,
			startAdornment,
			endAdornment,
			type,
			selectItems,
			radioItems,
			inputProps,
			helperText,
			disabled,
			sibling,
			controlled = true,
			onChange,
			onkeyPress,
			component
		} = input;

		if (type === 'component') return component;
		else if (type === 'select')
			return (
				<Fragment key={name}>
					<FormControl disabled={disabled ? disabled : false} fullWidth>
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
					{sibling ? sibling : null}
				</Fragment>
			);
		else if (type === 'checkbox')
			return (
				<Fragment key={name}>
					<FormControlLabel
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
					{sibling ? sibling : null}
				</Fragment>
			);
		else if (type === 'radio')
			return (
				<Fragment key={name}>
					<FormControl>
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
					{sibling ? sibling : null}
				</Fragment>
			);
		else if (type === 'number')
			return (
				<Fragment key={name}>
					<TextField
						classes={{
							root: textField
						}}
						type={'number'}
						{...formikProps(name, label, placeholder, controlled, onChange)}
						fullWidth
						inputProps={{ ...inputProps }}
					/>
					{sibling ? sibling : null}
				</Fragment>
			);
		else if (type === 'textarea')
			return (
				<Fragment key={name}>
					<TextField
						type={'text'}
						multiline
						rows={10}
						defaultValue={defaultValue}
						{...formikProps(name, label, placeholder, controlled, onChange)}
						fullWidth
					/>
					{sibling ? sibling : null}
				</Fragment>
			);
		else
			return name.toLowerCase().includes('password') ? (
				<Fragment key={name}>
					<TextField
						classes={{
							root: textField
						}}
						type={state.showPassword ? 'text' : 'password'}
						{...formikProps(name, label, placeholder, controlled, onChange)}
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
					{sibling ? sibling : null}
				</Fragment>
			) : (
				<Fragment key={name}>
					<TextField
						classes={{
							root: textField
						}}
						type={'text'}
						{...formikProps(name, label, placeholder, controlled, onChange, onkeyPress)}
						fullWidth
						InputProps={decideAdornment(name, InputProps, startAdornment, endAdornment)}
					/>
					{sibling ? sibling : null}
				</Fragment>
			);
	};

	return (
		<form className={`form${classNames ? ' ' + classNames : ''}`} onSubmit={handleSubmit}>
			<div className={`form-content`}>
				{inputs.map((input) => {
					if (input.type === 'group')
						if (input.treeView)
							return (
								<TreeView
									key={input.name}
									defaultCollapseIcon={<ExpandMoreIcon />}
									defaultExpandIcon={<ChevronRightIcon />}
									defaultExpanded={[ '1' ]}
								>
									<TreeItem nodeId="1" label={decideLabel(input.name)}>
										<FormGroup row={false}>{input.children.map((child) => renderFormComponent(child))}</FormGroup>
									</TreeItem>
								</TreeView>
							);
						else return <FormGroup row={true}>{input.children.map((child) => renderFormComponent(child))}</FormGroup>;
					else return renderFormComponent(input);
				})}
				{children}
			</div>
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
