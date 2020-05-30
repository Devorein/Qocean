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
		timeout: this.props.timeout,
		timer: null
	};

	clearInterval = () => {
		clearInterval(this.state.timer);
		this.setState({
			timer: null,
			timeout: 0
		});
	};

	UNSAFE_componentWillReceiveProps = (nextProps) => {
		if (nextProps.timeout !== this.state.timeout) {
			clearInterval(this.state.timer);
			const timer = setInterval(() => {
				if (this.state.timeout !== 0) {
					this.setState({
						timeout: this.state.timeout - 1
					});
				} else {
					this.props.onTimerEnd();
					clearInterval(timer);
				}
			}, 1000);
			this.setState({
				timeout: nextProps.timeout,
				timer
			});
		}
	};

	displayTime = (time) => {
		const min = Math.floor(time / 60);
		const sec = time % 60;
		return `0${min}:${sec < 10 ? '0' + sec : sec}`;
	};

	render() {
		const { timeout } = this.state;
		return this.props.children({
			timer: <TimerDisplay>{this.displayTime(timeout)}</TimerDisplay>,
			currentTime: timeout,
			clearInterval: this.clearInterval
		});
	}
}

export default Timer;
