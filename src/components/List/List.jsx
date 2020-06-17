import React from 'react';
import { HotKeys } from 'react-hotkeys';
import { difference } from 'lodash';
import Checkbox from '@material-ui/core/Checkbox';

const keyMap = {
	MOVE_UP: 'up',
	MOVE_DOWN: 'down',
	CHECK: [ 'shift+s', 'alt+s', 'shift+alt+s', 's' ]
};

Array.create = function(length) {
	return new Array(length).fill(0).map((_, index) => index);
};

class List extends React.Component {
	state = {
		checked: [],
		selectedIndex: 0
	};

	handleChecked = (index, e) => {
		const { checked } = this.state;
		const { totalItems } = this.props;
		if (e.shiftKey && e.altKey) {
			this.setState({
				checked: difference(Array.create(index + 1), checked)
			});
		} else if (e.shiftKey) {
			if (checked.includes(index))
				this.setState({
					checked: difference(checked, Array.create(index + 1))
				});
			else
				this.setState({
					checked: Array.create(index + 1)
				});
		} else if (e.altKey) {
			if (checked.includes(index))
				this.setState({
					checked: difference(Array.create(totalItems), [ index ])
				});
			else
				this.setState({
					checked: [ index ]
				});
		} else {
			const currentIndex = checked.indexOf(index);
			const newChecked = [ ...checked ];
			if (currentIndex === -1) newChecked.push(index);
			else newChecked.splice(currentIndex, 1);
			this.setState({
				checked: newChecked
			});
		}
	};

	handleCheckedAll = () => {
		const { totalItems } = this.props;
		const shouldCheck = this.state.checked.length < totalItems;
		if (shouldCheck && totalItems !== 0)
			this.setState({
				checked: new Array(totalItems).fill(0).map((_, index) => index)
			});
		else
			this.setState({
				checked: []
			});
	};

	handlers = {
		MOVE_UP: (e) => {
			this.setState({
				selectedIndex: this.state.selectedIndex > 0 ? this.state.selectedIndex - 1 : this.props.totalItems - 1
			});
		},

		MOVE_DOWN: (e) => {
			this.setState({
				selectedIndex: this.state.selectedIndex < this.props.totalItems - 1 ? this.state.selectedIndex + 1 : 0
			});
		},
		CHECK: (event) => this.handleChecked(this.state.selectedIndex, event)
	};

	render() {
		const { checked, selectedIndex } = this.state;
		const { handleChecked, handleCheckedAll, handlers } = this;
		const { AllCheckboxClass, children, totalItems, SelectStatClass, prefix } = this.props;
		return (
			<HotKeys keyMap={keyMap} className="React-hotkeys" handlers={handlers}>
				{children({
					checked,
					selectedIndex,
					handleChecked,
					handleCheckedAll,
					moveUp: handlers.MOVE_UP,
					moveDown: handlers.MOVE_DOWN,
					setSelectedIndex: (index, useGiven = false) => {
						let { checked } = this.state;
						if (useGiven) checked = index;
						else {
							const indexOf = checked.indexOf(index);
							if (indexOf === -1) checked.push(index);
							else checked.splice(indexOf, 1);
						}
						this.setState({
							checked
						});
					},
					resetChecked: () => {
						this.setState({
							checked: []
						});
					},
					AllCheckbox: (
						<div className={`${AllCheckboxClass || ''} ${prefix ? prefix + 'AllCheckbox' : ''} List_AllCheckbox`}>
							<Checkbox
								onClick={handleCheckedAll}
								edge="start"
								checked={checked.length === totalItems && totalItems !== 0}
								tabIndex={-1}
								disableRipple
								color="primary"
								inputProps={{ 'aria-labelledby': 'Select All' }}
							/>
						</div>
					),
					SelectStat: (
						<div className={`${SelectStatClass || ''} ${prefix ? prefix + 'SelectStat' : ''} List_SelectStat`}>
							{checked.length}/{totalItems}
						</div>
					)
				})}
			</HotKeys>
		);
	}
}

export default List;
