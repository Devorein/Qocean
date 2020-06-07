import React, { Component, Fragment } from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Icon from '@material-ui/core/Icon';
import FormHelperText from '@material-ui/core/FormHelperText';
import shortId from 'shortid';

class InputSelect extends Component {
	render() {
		const {
			className,
			disabled,
			disabledSelect = false,
			selectItems,
			onChange,
			name = 'select',
			helperText,
			value
		} = this.props;
		return (
			<div className={`inputselect ${className}`}>
				<FormControl disabled={disabled ? disabled : false} fullWidth>
					{!disabled ? (
						<Fragment>
							<InputLabel id={name}>
								{name.split('_').map((name) => name.charAt(0).toUpperCase() + name.substr(1)).join(' ')}
							</InputLabel>
							<Select disabled={disabledSelect} name={name} value={value} onChange={onChange}>
								{selectItems.map(({ value, text, icon }) => {
									return (
										<MenuItem key={shortId.generate()} value={value ? value : text}>
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
			</div>
		);
	}
}

export default InputSelect;
