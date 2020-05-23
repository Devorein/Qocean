import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import getIcons from '../../Utils/getIcons';
import Checkbox from '@material-ui/core/Checkbox';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
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
	},
	iconRoot: {
		minWidth: 30
	},
	listTitle: {
		margin: theme.spacing(1, 0, 2)
	}
}));

export default function CustomList({ listItems, title, classNames, containsCheckbox }) {
	const { root, iconRoot, listTitle } = useStyles();
	const rootClass = clsx(root, 'List', classNames);

	const [ checked, setChecked ] = React.useState([ 0 ]);

	const handleToggle = (value) => () => {
		const currentIndex = checked.indexOf(value);
		const newChecked = [ ...checked ];

		if (currentIndex === -1) newChecked.push(value);
		else newChecked.splice(currentIndex, 1);
		setChecked(newChecked);
	};

	return (
		<div className={rootClass}>
			<Typography variant="h6" className={listTitle}>
				{title}
			</Typography>
			<List dense={false}>
				{listItems.map((listItem) => {
					const { primary, secondary, primaryIcon, secondaryIcon, _id } = listItem;
					return (
						<ListItem key={_id} onClick={handleToggle(primary)}>
							{containsCheckbox ? (
								<ListItemIcon>
									<Checkbox
										edge="start"
										checked={checked.indexOf(primary) !== -1}
										tabIndex={-1}
										disableRipple
										color="primary"
										inputProps={{ 'aria-labelledby': primary }}
									/>
								</ListItemIcon>
							) : null}
							<ListItemIcon classes={{ root: iconRoot }}>{getIcons(primaryIcon)}</ListItemIcon>
							<ListItemText primary={primary} secondary={secondary} />
							{/* <ListItemSecondaryAction>
									<IconButton edge="end" aria-label="delete">
										{getIcons(secondaryIcon)}
									</IconButton>
								</ListItemSecondaryAction> */}
						</ListItem>
					);
				})}
			</List>
		</div>
	);
}
