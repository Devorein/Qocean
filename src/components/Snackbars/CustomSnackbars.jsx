import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		'& > * + *': {
			marginTop: theme.spacing(2)
		}
	}
}));

export default function CustomizedSnackbars({ message, severity, isOpen, changeResponse }) {
	const classes = useStyles();

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') return;
		changeResponse(message, severity, false);
	};

	return (
		<div className={classes.root}>
			<Snackbar open={isOpen} autoHideDuration={2500} onClose={handleClose}>
				<Alert severity={severity} onClose={handleClose}>
					{message}
				</Alert>
			</Snackbar>
		</div>
	);
}
