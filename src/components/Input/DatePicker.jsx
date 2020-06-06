import React, { Component } from 'react';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

class DatePicker extends Component {
	render() {
		let { value, onChange } = this.props;
		value = value === '' ? moment.unix(Date.now()).format('dd/MM/yyyy') : value;
		return (
			<MuiPickersUtilsProvider utils={MomentUtils}>
				<KeyboardDatePicker
					disableToolbar
					variant="inline"
					format="dd/MM/yyyy"
					margin="normal"
					id="date-picker-inline"
					label="Pick date"
					value={value}
					onChange={onChange}
					KeyboardButtonProps={{
						'aria-label': 'change date'
					}}
				/>
			</MuiPickersUtilsProvider>
		);
	}
}

export default DatePicker;
