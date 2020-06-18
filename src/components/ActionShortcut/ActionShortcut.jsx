import React, { Component } from 'react';
import { HotKeys } from 'react-hotkeys';

class ActionShortcut extends Component {
	render() {
		const { actions } = this.props;
		const keyMap = {};
		const handlers = {};
		const evt = new MouseEvent('click', {
			bubbles: true,
			cancelable: true,
			view: window
		});

		Object.keys(actions).forEach((key, index) => {
			keyMap[key] = `${index}`;
			handlers[key] = (e) => {
				actions[key].dispatchEvent(evt);
			};
		});
		return (
			<HotKeys className="React-hotkeys" keyMap={keyMap} handlers={handlers}>
				{this.props.children()}
			</HotKeys>
		);
	}
}

export default ActionShortcut;
