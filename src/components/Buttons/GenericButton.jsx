import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

function GenericButton({ text, classes }) {
	return (
		<Button
			variant="contained"
			color="primary"
			size="medium"
			classes={{ root: classes.root }}
			startIcon={<PlayArrowIcon />}
		>
			{text}
		</Button>
	);
}

export default withStyles((theme) => ({
	root: {
		width: '25%',
		minWidth: '100px',
		maxWidth: 100,
		textAlign: 'center',
		height: '50px',
		'& > *': {
			margin: 0
		},
		'& .MuiButton-label': {
			display: 'flex'
		}
	}
}))(GenericButton);
