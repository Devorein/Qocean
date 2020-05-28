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
	componentDidMount() {
		const { timeout, onTimerChange } = this.props;
		const timer = setInterval(() => {
			if (timeout === 0) {
				clearInterval(timer);
			} else onTimerChange();
		}, 1000);
	}

	displayTime = (time) => {
		const min = Math.floor(time / 60);
		const sec = time % 60;
		return `0${min}:${sec < 10 ? '0' + sec : sec}`;
	};

	render() {
		const { timeout } = this.props;
		return <TimerDisplay>{this.displayTime(timeout)}</TimerDisplay>;
	}
}

export default Timer;
