import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function AutoCompleteInput({ options, optionProp, label, onChange }) {
	return (
		<Autocomplete
			onChange={onChange}
			multiple
			options={options || []}
			disableCloseOnSelect
			getOptionLabel={(option) => option[optionProp]}
			getOptionSelected={(option, value) => value._id === option._id}
			renderOption={(option, { selected }) => (
				<React.Fragment>
					<Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
					{option[optionProp]}
				</React.Fragment>
			)}
			renderInput={(params) => <TextField {...params} variant="outlined" label={label} />}
		/>
	);
}
