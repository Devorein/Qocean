import React, { Component } from 'react';
import { HotKeys } from 'react-hotkeys';

const evt = new MouseEvent('click', {
	bubbles: true,
	cancelable: true,
	view: window
});

class ActionShortcut extends Component {
	render() {
		const { actions, prefix } = this.props;
		const keyMap = {};
		const handlers = {};
		Object.keys(actions).filter((key) => actions[key]).forEach((key, index) => {
			keyMap[key] = `${prefix ? prefix + '+' : ''}${index}`;
			handlers[key] = (e) => {
				actions[key].dispatchEvent(evt);
			};
		});

		return (
			<HotKeys className="React-hotkeys" keyMap={keyMap} handlers={handlers} allowChanges={true}>
				{this.props.children()}
			</HotKeys>
		);
	}
}

export default ActionShortcut;
