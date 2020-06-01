import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

function GenericButton({ disabled, text, classes, onClick, buttonRef, icon, size, color, variant }) {
	return (
		<Button
			variant={variant ? variant : 'contained'}
			color={color ? color : 'primary'}
			size={size ? size : 'medium'}
			classes={{ root: classes.root }}
			// startIcon={<PlayArrowIcon />}
			onClick={onClick}
			ref={(r) => (buttonRef ? buttonRef(r) : null)}
			disabled={disabled}
		>
			{text}
		</Button>
	);
}

export default withStyles((theme) => ({
	root: {
		width: '25%',
		minWidth: '100px',
		maxWidth: 'fit-content',
		textAlign: 'center',
		'& > *': {
			margin: 0
		},
		'& .MuiButton-label': {
			display: 'flex'
		}
	}
}))(GenericButton);
