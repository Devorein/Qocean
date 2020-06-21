import React, { Component } from 'react';
import { HotKeys } from 'react-hotkeys';

import { AppContext } from '../../context/AppContext';

const evt = new MouseEvent('click', {
	bubbles: true,
	cancelable: true,
	view: window
});

class ActionShortcut extends Component {
	static contextType = AppContext;

	render() {
		const { actions, prefix } = this.props;
		const keyMap = {};
		const handlers = {};
		const keybindings = this.context.user ? this.context.user.current_environment.keybindings : null;
		Object.keys(actions).filter((key) => actions[key]).forEach((key, index) => {
			keyMap[key] = keybindings ? keybindings[key] : `${prefix ? prefix + '+' : ''}${index}`;
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
