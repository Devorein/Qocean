import React from 'react';

import DeletableChip from './DeletableChip';
import RegularChip from './RegularChip';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		justifyContent: 'center',
		flexWrap: 'wrap',
		'& > *': {
			margin: theme.spacing(0.5)
		},
		'& .MuiChip-root': {
			borderRadius: 3,
			fontFamily: 'Quantico'
		}
	}
}));

function ChipContainer({ type, chips, onClick, onIconClick }) {
	const classes = useStyles();
	return (
		<div className={classes.root}>
			{chips.map((tag) => {
				if (type === 'delete') return <DeletableChip key={tag} tag={tag} onClick={onClick} onDelete={onIconClick} />;
				else if (type === 'regular') return <RegularChip key={tag} tag={tag} onClick={onClick} />;
				else return null;
			})}
		</div>
	);
}

export default ChipContainer;
