import React, { Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import getIcons from '../../Utils/getIcons';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import clsx from 'clsx';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { HotKeys } from 'react-hotkeys';
import shortid from 'shortid';

import './List.scss';

const keyMap = {
	MOVE_UP: 'up',
	MOVE_DOWN: 'down',
	CHECK: 'right'
};

class CustomList extends React.Component {
	state = {
		checked: [],
		manipulated: false,
		filteredItems: this.props.listItems || [],
		selectedIndex: 0
	};

	UNSAFE_componentWillReceiveProps(props) {
		this.setState({
			filteredItems: props.listItems
		});
	}

	handleToggle = (index, e) => {
		const { listItems, setChecked } = this.props;
		const { checked } = this.state;

		if (e.shiftKey)
			this.setState(
				{
					checked: new Array(index + 1).fill(0).map((_, index) => index)
				},
				() => {
					if (setChecked) setChecked(this.state.checked);
				}
			);
		else if (e.altKey) {
			const isThere = checked.includes(index);
			if (isThere)
				this.setState(
					{
						checked: new Array(listItems.length).fill(0).map((_, _index) => (_index !== index ? index : void 0))
					},
					() => {
						if (setChecked) setChecked(checked);
					}
				);
			else
				this.setState(
					{
						checked: [ index ]
					},
					() => {
						if (setChecked) setChecked(checked);
					}
				);
		} else {
			const currentIndex = checked.indexOf(index);
			const newChecked = [ ...checked ];
			if (currentIndex === -1) newChecked.push(index);
			else newChecked.splice(currentIndex, 1);
			this.setState(
				{
					checked: newChecked
				},
				() => {
					if (setChecked) setChecked(checked);
				}
			);
		}
	};

	handleToggleAll = () => {
		const { listItems, setChecked } = this.props;
		const { checked, filteredItems, manipulated } = this.state;
		const target = manipulated ? filteredItems : listItems;
		const shouldCheck = checked.length < target.length;
		if (shouldCheck)
			this.setState(
				{
					checked: target.map((_, index) => index)
				},
				() => {
					if (setChecked) setChecked(this.state.checked);
				}
			);
		else
			this.setState(
				{
					checked: []
				},
				() => {
					if (setChecked) setChecked(this.state.checked);
				}
			);
	};

	filterList = (e) => {
		this.setState({
			filteredItems: this.props.listItems.filter(({ primary }) => primary.includes(e.target.value)),
			manipulated: true
		});
	};

	handlers = {
		MOVE_UP: (event) => this.onKeyDown('up'),
		MOVE_DOWN: (event) => this.onKeyDown('down')
	};

	onKeyDown = (keyName, e) => {
		if (keyName === 'down') this.moveDown(e);
		else if (keyName === 'up') this.moveUp(e);
	};

	moveUp = (e) => {
		this.setState({
			selectedIndex: this.state.selectedIndex > 0 ? this.state.selectedIndex - 1 : this.state.filteredItems.length - 1
		});
	};

	moveDown = (e) => {
		this.setState({
			selectedIndex: this.state.selectedIndex < this.state.filteredItems.length - 1 ? this.state.selectedIndex + 1 : 0
		});
	};

	renderList = () => {
		const { handleToggle, handleToggleAll, filterList, moveLeft, moveRight } = this;

		const { classes, className, title, containsCheckbox = true, selectedIcons, listItems } = this.props;
		const { manipulated, filteredItems, checked, selectedIndex } = this.state;

		const items = manipulated ? filteredItems : listItems;
		const rootClass = clsx(className, classes.listContainer, 'CustomList');

		return (
			<div className={rootClass}>
				<div className={clsx('CustomList_Header', classes.Header)}>
					{title ? (
						<h1 variant="h6" className={'CustomList_title'}>
							{title}
						</h1>
					) : null}
					<TextField onChange={filterList} className="CustomList_Header_search" />
					<div className="CustomList_Header_Icons">
						{checked.length >= 1 && selectedIcons ? (
							selectedIcons.map(({ icon, onClick }, index) =>
								React.createElement(icon, {
									key: shortid.generate(),
									onClick: onClick.bind(null, this.state.checked)
								})
							)
						) : null}
						<ChevronLeftIcon onClick={moveLeft} />
						<ChevronRightIcon onClick={moveRight} />
						<div onClick={handleToggleAll} className={'CustomList_Header_toggle'}>
							<Checkbox
								edge="start"
								checked={checked.length === items.length && items.length !== 0}
								tabIndex={-1}
								disableRipple
								color="primary"
								inputProps={{ 'aria-labelledby': 'Select All' }}
							/>
						</div>
						<div className={'CustomList_Header_checked'}>
							{checked.length} / {items.length}
						</div>
					</div>
				</div>

				<div className={clsx('CustomList_Body', classes.Body)}>
					{items.map((listItem, index) => {
						const { primary, secondary, primaryIcon, key } = listItem;
						return (
							<HotKeys
								key={key ? key : primary}
								keyMap={keyMap}
								handlers={{
									...this.handlers,
									CHECK: (event) => handleToggle(this.state.selectedIndex, event)
								}}
								className="React-hotkeys"
							>
								<div
									className={clsx(
										selectedIndex === index ? 'selected' : null,
										classes.BodyItem,
										'CustomList_Body_Item'
									)}
								>
									<div className={'CustomList_Body_Item_index'}>{index + 1}</div>

									{containsCheckbox ? (
										<div onClick={handleToggle.bind(null, index)} className={'CustomList_Body_Item_checkbox'}>
											<Checkbox
												edge="start"
												checked={checked.indexOf(index) !== -1}
												tabIndex={-1}
												disableRipple
												color="primary"
												inputProps={{ 'aria-labelledby': primary }}
											/>
										</div>
									) : null}
									<div className={'CustomList_Body_Item_icon'}>{getIcons(primaryIcon)}</div>
									<div className={'CustomList_Body_Item_Content'}>
										<div className={'CustomList_Body_Item_Content_primary'}>{primary}</div>
										<div className={'CustomList_Body_Item_Content_secondary'}>{secondary}</div>
									</div>
								</div>
							</HotKeys>
						);
					})}
				</div>
			</div>
		);
	};

	render() {
		const { renderList } = this;
		const { selectedIndex, checked } = this.state;
		return (
			<Fragment>
				{this.props.children ? (
					this.props.children({
						list: renderList(),
						checked,
						selectedIndex
					})
				) : (
					renderList()
				)}
			</Fragment>
		);
	}
}

export default withStyles((theme) => ({
	listContainer: {
		background: theme.palette.background.dark,
		'& .MuiListItem-root': {
			'&:hover': {
				background: theme.palette.primary.dark,
				transition: 'background 150ms ease-in-out',
				color: theme.palette.primary.contrastText
			}
		},
		'& .Muidiv-root': {
			color: theme.palette.primary.main
		}
	},
	Header: {
		backgroundColor: theme.palette.background.dark
	},
	Body: {
		background: theme.palette.background.main
	},
	BodyItem: {
		'&.MuiListItem-root': {
			height: 50,
			padding: 5
		},
		'&.selected': {
			backgroundColor: theme.palette.grey['A400']
		}
	}
}))(CustomList);
