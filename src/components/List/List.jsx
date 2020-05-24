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
import GridList from '@material-ui/core/GridList';
import clsx from 'clsx';

const ListContainer = withStyles((theme) => ({
	root: {
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
	}
}))(Container);

const IconContainer = withStyles((theme) => ({
	root: {
		gridArea: '2/2/3/3',
		display: 'flex',
		justifyContent: 'space-around',
		alignItems: 'center'
	}
}))(Container);

const MiniGrid = withStyles((theme) => ({
	root: {
		display: 'grid',
		gridTemplate: '75px 50px/1fr 1fr'
	}
}))(Container);

const MiniGridTitle = withStyles((theme) => ({
	root: {
		margin: theme.spacing(1, 0, 2),
		gridArea: '1/1/2/3',
		textAlign: 'center'
	}
}))(Typography);

const MiniGridTitle2 = withStyles((theme) => ({
	root: {
		gridArea: '2/1/3/2',
		textAlign: 'center',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	}
}))(Typography);

const EnhancedListItem = withStyles((theme) => ({
	root: {
		'&.selected': {
			backgroundColor: theme.palette.grey[800]
		}
	}
}))(ListItem);

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

	handleToggle = (value) => () => {
		const { checked } = this.state;
		const currentIndex = checked.indexOf(value);
		const newChecked = [ ...checked ];

		if (currentIndex === -1) newChecked.push(value);
		else newChecked.splice(currentIndex, 1);
		this.setState({
			checked: newChecked
		});
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
		const { listItems, title, containsCheckbox, onClick, selectedIcons } = this.props;
		return (
			<ListContainer>
				<MiniGrid>
					<MiniGridTitle variant="h6">{title}</MiniGridTitle>
					<MiniGridTitle2 variant="body2">{checked.length}(s) selected</MiniGridTitle2>
					{
						<IconContainer>
							<ListItemIcon onClick={handleToggleAll}>
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

				<List dense={false} style={{ overflowY: 'auto', maxHeight: '75%' }}>
					{listItems.map((listItem, index) => {
						const { primary, secondary, primaryIcon, secondaryIcon } = listItem;
						return (
							<EnhancedListItem key={primary} className={lastClicked === index ? 'selected' : null}>
								{containsCheckbox ? (
									<ListItemIcon onClick={handleToggle(index)}>
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
											() => onClick.bind(null, index)
										);
									}}
								/>
								{/* <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete">
                  {getIcons(secondaryIcon)}
                </IconButton>
              </ListItemSecondaryAction> */}
							</EnhancedListItem>
						);
					})}
				</List>
			</ListContainer>
		);
	}
}

export default CustomList;
