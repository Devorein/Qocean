import React from 'react';
import { makeStyles, withStyles, styled } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import getIcons from '../../Utils/getIcons';
import Checkbox from '@material-ui/core/Checkbox';
import Container from '@material-ui/core/Container';
import clsx from 'clsx';

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

const MiniGridTitle2 = withStyles((theme) => ({
	root: {
		gridArea: '2/1/3/2',
		textAlign: 'center',
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center'
	}
}))(Typography);

const EnhancedListItemText = withStyles((theme) => ({
	root: {
		whiteSpace: 'nowrap',
		overflowX: 'auto'
	}
}))(ListItemText);

class CustomList extends React.Component {
	state = {
		checked: []
	};

	handleToggle = (index, e) => {
		if (e.shiftKey)
			this.setState({
				checked: new Array(index + 1).fill(0).map((_, index) => index)
			});
		else if (e.altKey) {
			const isThere = this.state.checked.includes(index);
			if (isThere)
				this.setState({
					checked: new Array(this.props.listItems.length)
						.fill(0)
						.map((_, _index) => (_index !== index ? index : void 0))
				});
			else
				this.setState({
					checked: [ index ]
				});
		} else {
			const { checked } = this.state;
			const currentIndex = checked.indexOf(index);
			const newChecked = [ ...checked ];

			if (currentIndex === -1) newChecked.push(index);
			else newChecked.splice(currentIndex, 1);
			this.setState({
				checked: newChecked
			});
		}
	};

	handleToggleAll = () => {
		const shouldCheck = this.state.checked.length < this.props.listItems.length;
		if (shouldCheck)
			this.setState({
				checked: this.props.listItems.map((_, index) => index)
			});
		else
			this.setState({
				checked: []
			});
	};

	render() {
		const { handleToggle, handleToggleAll } = this;
		const { checked, lastClicked } = this.state;
		const { listItems, title, containsCheckbox, onClick, selectedIcons, classes } = this.props;
		return (
			<Container classes={{ root: classes.listContainer }}>
				<MiniGrid>
					<Typography variant="h6" classes={{ root: classes.listHeader }}>
						{title}
					</Typography>
					<MiniGridTitle2 variant="body2">{checked.length}(s) selected</MiniGridTitle2>
					{
						<IconContainer>
							<ListItemIcon classes={{ root: classes.listItemIcon }} onClick={handleToggleAll}>
								<Checkbox
									edge="start"
									checked={checked.length === listItems.length}
									tabIndex={-1}
									disableRipple
									color="primary"
									inputProps={{ 'aria-labelledby': 'Select All' }}
								/>
							</ListItemIcon>
							{checked.length >= 1 ? selectedIcons.map((icon) => icon) : null}
						</IconContainer>
					}
				</MiniGrid>

				<List dense={false} classes={{ root: classes.listBody }}>
					{listItems.map((listItem, index) => {
						const { primary, secondary, primaryIcon, secondaryIcon, key } = listItem;
						return (
							<ListItem
								key={key ? key : primary}
								classes={{ root: classes.listItem }}
								className={lastClicked === index ? 'selected' : null}
							>
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
												lastClicked: index
											},
											() => {
												onClick(index);
											}
										);
									}}
								/>
								{/* <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete">
                  {getIcons(secondaryIcon)}
                </IconButton>
              </ListItemSecondaryAction> */}
							</ListItem>
						);
					})}
				</List>
			</Container>
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
		backgroundColor: theme.palette.grey[900]
	},
	listBody: {
		overflowY: 'auto',
		maxHeight: '75%',
		background: theme.palette.grey[800]
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
	listItemIcon: {
		minWidth: 25
	}
}))(CustomList);
