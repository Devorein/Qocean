import React, { Component } from 'react';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
class DatePicker extends Component {
	render() {
		let { value, onChange, disabled = false } = this.props;
		value = value === '' ? moment(Date.now()).toISOString() : value;
		return (
			<MuiPickersUtilsProvider utils={MomentUtils}>
				<KeyboardDatePicker
					disabled={disabled}
					disableFuture
					disableToolbar
					variant="inline"
					format="DD/MM/YYYY"
					margin="normal"
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
