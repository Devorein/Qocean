import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function AutoCompleteInput({ isArray, disabled, options, optionProp, label, onChange }) {
	return (
		<Autocomplete
			disabled={disabled}
			onChange={onChange}
			multiple
			options={options || []}
			disableCloseOnSelect
			getOptionLabel={(option) => (!isArray ? option[optionProp] : option)}
			getOptionSelected={(option, value) => (!isArray ? value._id === option._id : value === option)}
			renderOption={(option, { selected }) => (
				<React.Fragment>
					<Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
					{!isArray ? option[optionProp] : option}
				</React.Fragment>
			)}
			renderInput={(params) => <TextField {...params} variant="outlined" label={label} />}
		/>
	);
}
