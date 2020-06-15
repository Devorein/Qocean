import React, { Component } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormLabel from '@material-ui/core/FormLabel';

class RadioInput extends Component {
	decideLabel = (name, label) => {
		if (label) return label;
		else return name.split('_').map((name) => name.charAt(0).toUpperCase() + name.substr(1)).join(' ');
	};

	render() {
		const {
			defaultValue,
			name = '',
			radioItems,
			onChange,
			value,
			OptionsContainer,
			OptionContainer,
			optionProps
		} = this.props;

		const RADIOGROUP = (
			<RadioGroup row onChange={onChange} value={value} defaultValue={defaultValue}>
				{radioItems.map(
					({ label, value }) =>
						OptionContainer ? (
							<OptionContainer {...optionProps} key={value}>
								<FormControlLabel
									control={<Radio color="primary" />}
									value={value}
									label={label ? label : value}
									labelPlacement="end"
								/>
							</OptionContainer>
						) : (
							<FormControlLabel
								key={value}
								control={<Radio color="primary" />}
								value={value}
								label={label ? label : value}
								labelPlacement="end"
								className={this.props.radioItemsClass || ''}
							/>
						)
				)}
			</RadioGroup>
		);
		return (
			<FormControl>
				{name ? <FormLabel component="legend">{this.decideLabel(name)}</FormLabel> : null}
				{OptionsContainer ? <OptionsContainer>{RADIOGROUP}</OptionsContainer> : RADIOGROUP}
			</FormControl>
		);
	}
}

export default RadioInput;
