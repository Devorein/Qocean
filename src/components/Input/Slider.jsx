import React, { Component } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import Slider from '@material-ui/core/Slider';

function ValueLabelComponent(props) {
	const { children, open, value } = props;
	return (
		<Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
			{children}
		</Tooltip>
	);
}

class CustomSlider extends Component {
	state = {
		slider: this.props.slider || [ 0, 100 ]
	};
	render() {
		const { min = 0, max = 100, step = 1 } = this.props;
		return (
			<Slider
				key="time_slider"
				value={this.state.slider}
				min={min}
				max={max}
				step={step}
				ValueLabelComponent={ValueLabelComponent}
				onChange={(e, value) => {
					this.setState({
						slider: value
					});
				}}
			/>
		);
	}
}

export default CustomSlider;
