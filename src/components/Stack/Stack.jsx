import React from 'react';

class Stack extends React.Component {
	state = {
		stack: [],
		currentIndex: -1
	};

	addToStack = (item) => {
		const { stack, currentIndex } = this.state;
		stack.push(item);
		this.setState({
			stack,
			currentIndex: currentIndex + 1
		});
	};

	changeCurrentIndex = (currentIndex) => {
		this.setState({
			currentIndex
		});
	};

	removeFromStack = (dir) => {
		let { stack, currentIndex } = this.state;
		if (dir === 'left') {
			stack.splice(0, currentIndex);
			currentIndex = 0;
		} else if (dir === 'right') stack.splice(currentIndex + 1, stack.length - currentIndex);
		this.setState({
			stack,
			currentIndex
		});
	};

	removeDuplicates = () => {
		let { stack, currentIndex } = this.state;
		stack = Array.from(new Set(stack));
		if (stack.length - 1 > currentIndex) currentIndex = 0;
		this.setState({
			stack,
			currentIndex
		});
	};

	move = (dir) => {
		let { currentIndex, stack } = this.state;
		let changed = false;
		if (currentIndex !== stack.length - 1 && dir === 'right') {
			currentIndex++;
			changed = true;
		} else if (currentIndex !== 0 && dir === 'left') {
			currentIndex--;
			changed = true;
		}

		if (changed) this.setState({ currentIndex });
	};

	render() {
		const { props: { children }, removeDuplicates, removeFromStack, changeCurrentIndex, move, addToStack } = this;
		return children({
			StackState: this.state,
			removeDuplicates,
			changeCurrentIndex,
			moveRight: move.bind(null, 'right'),
			moveLeft: move.bind(null, 'left'),
			addToStack,
			removeFromStack
		});
	}
}

export default Stack;
