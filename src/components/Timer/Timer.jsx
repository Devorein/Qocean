import React, { Component } from 'react';
import styled from 'styled-components';

const TimerDisplay = styled.div`
	padding: 5px 20px;
	margin: 5px;
	display: flex;
	justify-content: center;
	align-items: center;
	font-weight: bold;
`;

class Timer extends Component {
	state = {
		timeout: this.props.timeout
	};

	componentDidMount() {
		const timer = setInterval(() => {
			if (this.state.timeout === 0) {
				this.setState({
					timeout: 0
				});
				clearInterval(timer);
				this.props.onTimerEnd();
			} else {
				this.setState({
					timeout: this.state.timeout - 1
				});
			}
		}, 1000);
	}

	render() {
		const { timeout } = this.state;
		return <div>{timeout}</div>;
	}
}

export default Timer;
