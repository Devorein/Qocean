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

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		maxWidth: 752
	},
	demo: {
		backgroundColor: theme.palette.background.paper
	},
	title: {
		margin: theme.spacing(4, 0, 2)
	}
}));

export default function CustomList({ listItems, title }) {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<Typography variant="h6" className={classes.title}>
				{title}
			</Typography>
			<List dense={false}>
				<div className={classes.demo}>
					{listItems.map((listItem) => {
						const { primary, secondary, primaryIcon, secondaryIcon, _id } = listItem;
						return (
							<ListItem key={_id}>
								<ListItemIcon>{getIcons(primaryIcon)}</ListItemIcon>
								<ListItemText primary={primary} secondary={secondary} />
								{/* <ListItemSecondaryAction>
									<IconButton edge="end" aria-label="delete">
										{getIcons(secondaryIcon)}
									</IconButton>
								</ListItemSecondaryAction> */}
							</ListItem>
						);
					})}
				</div>
			</List>
		</div>
	);
}
