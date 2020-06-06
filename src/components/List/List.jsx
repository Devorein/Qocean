import React, { Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import getIcons from '../../Utils/getIcons';
import Checkbox from '@material-ui/core/Checkbox';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import clsx from 'clsx';
import DeleteIcon from '@material-ui/icons/Delete';
import ReplayIcon from '@material-ui/icons/Replay';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { HotKeys } from 'react-hotkeys';
import shortid from 'shortid';

const keyMap = {
	MOVE_UP: 'up',
	MOVE_DOWN: 'down',
	CHECK: 'right'
};

const IconContainer = withStyles((theme) => ({
	root: {
		gridArea: '2/2/3/3',
		display: 'flex',
		justifyContent: 'flex-end',
		alignItems: 'center',
		padding: 0
	}
}))(Container);

const MiniGrid = withStyles((theme) => ({
	root: {
		display: 'grid',
		gridTemplate: '75px 50px/1fr 1fr'
	}
}))(Container);

const EnhancedListItemText = withStyles((theme) => ({
	root: {
		whiteSpace: 'nowrap',
		overflowX: 'auto'
	}
}))(ListItemText);

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

	deleteItems = (e) => {
		const { checked, manipulated, filteredItems } = this.state;
		const target = manipulated ? filteredItems : this.props.listItems;

		this.setState({
			filteredItems: target.filter((data, index) => !checked.includes(index)),
			manipulated: true,
			checked: filteredItems.map((item, index) => index)
		});
	};

	refetchData = (e) => {
		this.setState({
			filteredItems: this.props.listItems,
			manipulated: false
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
		const { handleToggle, handleToggleAll, filterList, deleteItems, refetchData, moveLeft, moveRight } = this;

		const {
			classes,
			className,
			title,
			containsCheckbox = true,
			onClick = () => {},
			selectedIcons,
			listItems
		} = this.props;
		const { manipulated, filteredItems, checked, selectedIndex } = this.state;

		const items = manipulated ? filteredItems : listItems;
		const rootClass = clsx(className, classes.listContainer, 'CustomList');

		return (
			<HotKeys keyMap={keyMap}>
				<Container className={rootClass}>
					<MiniGrid>
						<Typography variant="h6" classes={{ root: classes.listHeader }}>
							{title}
						</Typography>
						<TextField onChange={filterList} />
						{
							<IconContainer>
								{checked.length >= 1 && selectedIcons ? (
									selectedIcons.map(({ icon, onClick }, index) =>
										React.createElement(icon, {
											key: shortid.generate(),
											onClick: onClick.bind(null, this.state.checked)
										})
									)
								) : null}
								<DeleteIcon onClick={deleteItems} />
								<ReplayIcon onClick={refetchData} />
								<ChevronLeftIcon onClick={moveLeft} />
								<ChevronRightIcon onClick={moveRight} />
								<ListItemIcon classes={{ root: classes.listItemIcon }} onClick={handleToggleAll}>
									<Checkbox
										edge="start"
										checked={checked.length === items.length && items.length !== 0}
										tabIndex={-1}
										disableRipple
										color="primary"
										inputProps={{ 'aria-labelledby': 'Select All' }}
										className={classes.checkbox}
									/>
								</ListItemIcon>
								<ListItemText classes={{ root: classes.listSelected }}>{checked.length}</ListItemText>
							</IconContainer>
						}
					</MiniGrid>

					<List dense={false} classes={{ root: classes.listBody }}>
						{items.map((listItem, index) => {
							const { primary, secondary, primaryIcon, key } = listItem;
							return (
								<HotKeys
									key={key ? key : primary}
									handlers={{
										...this.handlers,
										CHECK: (event) => handleToggle(this.state.selectedIndex, event)
									}}
								>
									<ListItem
										classes={{ root: classes.listItem }}
										className={selectedIndex === index ? 'selected' : null}
									>
										<ListItemText classes={{ root: classes.listIndex }}>{index + 1}</ListItemText>

										{containsCheckbox ? (
											<ListItemIcon onClick={handleToggle.bind(null, index)}>
												<Checkbox
													edge="start"
													checked={checked.indexOf(index) !== -1}
													tabIndex={-1}
													disableRipple
													color="primary"
													inputProps={{ 'aria-labelledby': primary }}
												/>
											</ListItemIcon>
										) : null}
										<ListItemIcon>{getIcons(primaryIcon)}</ListItemIcon>
										<EnhancedListItemText
											primary={primary}
											secondary={secondary}
											onClick={(e) => {
												this.setState(
													{
														selectedIndex: index
													},
													() => {
														onClick(index);
													}
												);
											}}
										/>
									</ListItem>
								</HotKeys>
							);
						})}
					</List>
				</Container>
			</HotKeys>
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
		height: '100%',
		background: '#202020',
		color: '#ddd',
		padding: '5px',
		'& .MuiListItem-root': {
			'&:hover': {
				cursor: 'pointer',
				background: theme.palette.primary.dark,
				transition: 'background 150ms ease-in-out',
				color: theme.palette.primary.contrastText
			}
		},
		'& .MuiListItemIcon-root': {
			color: theme.palette.primary.main
		}
	},
	listHeader: {
		fontSize: '1.5rem',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		margin: theme.spacing(1, 0, 1.25),
		fontWeight: 'bolder',
		gridArea: '1/1/2/3',
		textAlign: 'center',
		backgroundColor: theme.palette.background.dark
	},
	listBody: {
		overflowY: 'auto',
		maxHeight: '80%',
		background: theme.palette.background.main
	},
	listIndex: {
		fontWeight: 'bolder',
		display: 'flex',
		justifyContent: 'flex-end',
		flex: 'none',
		width: 25
	},
	listItem: {
		'&.MuiListItem-root': {
			height: 50,
			padding: 5
		},
		'&.selected': {
			backgroundColor: theme.palette.grey['A400']
		}
	},
	listSelected: {
		fontWeight: 'bolder',
		fontSize: 16,
		paddingRight: 5,
		flex: 'none'
	},
	checkbox: {
		padding: 3
	},
	listItemIcon: {
		minWidth: 25
	}
}))(CustomList);
