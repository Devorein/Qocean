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
import Slider from '@material-ui/core/Slider';

import './Form.scss';

class Form extends React.Component {
	state = {
		showPassword: false
	};

	handleClickShowPassword = () => {
		this.setState({ showPassword: !this.state.showPassword });
	};

	decideLabel = (name, label) => {
		if (label) return label;
		else return name.split('_').map((name) => name.charAt(0).toUpperCase() + name.substr(1)).join(' ');
	};

	change = (name, fieldHandler, e) => {
		const { values, setValues, customHandler, handleChange, setFieldTouched } = this.props;
		if (e.persist) e.persist();
		handleChange(e);
		if (fieldHandler) fieldHandler(e.target.value);
		if (customHandler) customHandler(values, setValues, e);
		setFieldTouched(name, true, false);
	};

	formikProps = (name, label, placeholder, controlled, { onkeyPress, fieldHandler } = {}) => {
		const { values, handleBlur, touched, errors, errorBeforeTouched } = this.props;
		if (controlled)
			return {
				name,
				value: typeof values[name] === 'undefined' ? '' : values[name],
				onChange: this.change.bind(null, name, fieldHandler),
				onBlur: handleBlur,
				error: errorBeforeTouched ? Boolean(errors[name]) : touched[name] && Boolean(errors[name]),
				helperText: errorBeforeTouched ? errors[name] : touched[name] ? errors[name] : '',
				label: this.decideLabel(name, label),
				placeholder
			};
		else {
			return {
				name,
				onKeyPress: onkeyPress,
				onChange: fieldHandler,
				label: this.decideLabel(name, label)
			};
		}
	};

	decideIcon = (icon, onClick) => {
		if (icon === 'email') return <EmailIcon onClick={onClick} />;
		else if (icon === 'person') return <PersonIcon onClick={onClick} />;
		else if (icon === 'image') return <ImageIcon onClick={onClick} />;
		else if (icon === 'close' || icon === 'cancel') return <CancelIcon onClick={onClick} />;
	};

	decideAdornment = (name, InputProps, startAdornment, endAdornment) => {
		if (InputProps) return InputProps;
		else if (startAdornment) {
			return {
				startAdornment: <InputAdornment position="start">{this.decideIcon(startAdornment)}</InputAdornment>
			};
		} else if (endAdornment) {
			return {
				endAdornment: (
					<InputAdornment position="end">
						{this.decideIcon(endAdornment[0], endAdornment[1].bind(null, name))}
					</InputAdornment>
				)
			};
		}
	};

	renderFormComponent = (input) => {
		const { values, errors, handleBlur, touched, handleChange } = this.props;
		const {
			name,
			label,
			placeholder,
			defaultValue,
			InputProps,
			startAdornment,
			endAdornment,
			type = 'text',
			inputProps,
			helperText,
			disabled,
			siblings,
			controlled = true,
			onkeyPress,
			fieldHandler,
			component,
			extra
		} = input;
		if (type === 'component') return component;
		else if (type === 'component_') {
			return React.createElement(component, { ...extra.props });
		} else if (type === 'select')
			return (
				<Fragment key={name}>
					<FormControl disabled={disabled ? disabled : false} fullWidth>
						{!disabled ? (
							<Fragment>
								<InputLabel id={name}>{this.decideLabel(name, label)}</InputLabel>
								<Select name={name} value={values[name]} onChange={this.change.bind(null, name, fieldHandler)}>
									{extra.selectItems.map(({ value, text, icon }) => {
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
					{siblings ? siblings.map((sibling) => this.formComponentRenderer(sibling)) : null}
				</Fragment>
			);
		else if (type === 'slider') {
			return (
				<Slider
					name={name}
					value={values[name]}
					onChange={(e) => {
						handleChange(name);
					}}
					key={name}
					valueLabelDisplay="auto"
				/>
			);
		} else if (type === 'checkbox')
			return (
				<Fragment key={name}>
					<FormControlLabel
						control={
							<Checkbox
								color={'primary'}
								checked={values[name] === true ? true : false}
								name={name}
								onChange={this.change.bind(null, name, fieldHandler)}
								onBlur={handleBlur}
								error={touched[name] && errors[name]}
							/>
						}
						label={this.decideLabel(name, label)}
					/>
					{siblings ? siblings.map((sibling) => this.formComponentRenderer(sibling)) : null}
				</Fragment>
			);
		else if (type === 'radio') {
			const props = this.formikProps(name, label, placeholder, controlled, { fieldHandler });
			delete props.helperText;
			delete props.error;
			return (
				<Fragment key={name}>
					<FormControl>
						<FormLabel component="legend">{this.decideLabel(name, label)}</FormLabel>
						<RadioGroup row {...props} defaultValue={defaultValue}>
							{extra.radioItems.map(({ label, value }) => (
								<FormControlLabel
									key={value}
									control={<Radio color="primary" />}
									value={value}
									label={label}
									labelPlacement="end"
								/>
							))}
						</RadioGroup>
					</FormControl>
					{siblings ? siblings.map((sibling) => this.formComponentRenderer(sibling)) : null}
				</Fragment>
			);
		} else if (type === 'number')
			return (
				<Fragment key={name}>
					<TextField
						// defaultValue={defaultValue}
						type={'number'}
						{...this.formikProps(name, label, placeholder, controlled, { fieldHandler })}
						fullWidth
						inputProps={{ ...inputProps }}
					/>
					{siblings ? siblings.map((sibling) => this.formComponentRenderer(sibling)) : null}
				</Fragment>
			);
		else if (type === 'textarea')
			return (
				<Fragment key={name}>
					<TextField
						type={'text'}
						multiline
						rows={extra.row ? extra.row : 5}
						defaultValue={defaultValue}
						{...this.formikProps(name, label, placeholder, controlled, { fieldHandler })}
						fullWidth
					/>
					{siblings ? siblings.map((sibling) => this.formComponentRenderer(sibling)) : null}
				</Fragment>
			);
		else
			return name.toLowerCase().includes('password') ? (
				<Fragment key={name}>
					<TextField
						type={this.state.showPassword ? 'text' : 'password'}
						{...this.formikProps(name, label, placeholder, controlled, { fieldHandler })}
						fullWidth
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton aria-label="toggle password visibility" onClick={this.handleClickShowPassword}>
										{this.state.showPassword ? <Visibility /> : <VisibilityOff />}
									</IconButton>
								</InputAdornment>
							)
						}}
					/>
					{siblings ? siblings.map((sibling) => this.formComponentRenderer(sibling)) : null}
				</Fragment>
			) : (
				<Fragment key={name}>
					<TextField
						type={'text'}
						{...this.formikProps(name, label, placeholder, controlled, { onkeyPress, fieldHandler })}
						fullWidth
						InputProps={this.decideAdornment(name, InputProps, startAdornment, endAdornment)}
					/>
					{siblings ? siblings.map((sibling) => this.formComponentRenderer(sibling)) : null}
				</Fragment>
			);
	};

	formComponentRenderer = (input) => {
		if (input) {
			if (input.type === 'group') {
				if (input.extra.treeView)
					return (
						<TreeView
							key={input.name}
							defaultCollapseIcon={<ExpandMoreIcon />}
							defaultExpandIcon={<ChevronRightIcon />}
							defaultExpanded={[ input.extra.collapse ? null : '1' ]}
						>
							<TreeItem nodeId="1" label={this.decideLabel(input.name)}>
								<FormGroup row={false}>{input.children.map((child) => this.renderFormComponent(child))}</FormGroup>
							</TreeItem>
						</TreeView>
					);
				else
					return (
						<FormGroup row={true} key={input.name}>
							{input.children.map((child) => this.renderFormComponent(child))}
						</FormGroup>
					);
			} else return this.renderFormComponent(input);
		}
	};

	render() {
		const {
			handleSubmit,
			isValid,
			isSubmitting,
			submitMsg,
			inputs,
			children,
			resetMsg,
			resetForm,
			formButtons = true,
			classNames,
			disabled
		} = this.props;

		return (
			<form className={`${classNames ? ' ' + classNames : ''} form`} onSubmit={handleSubmit}>
				<div className={`form-content`}>
					{inputs.map((input) => this.formComponentRenderer(input))}
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
						<Button
							ref={(r) => (this.SubmitButton = r)}
							type="submit"
							variant="contained"
							color="primary"
							disabled={isSubmitting || !isValid || disabled}
						>
							{submitMsg ? submitMsg : 'Submit'}
						</Button>
					</FormGroup>
				) : null}
			</form>
		);
	}
}

export default Form;
