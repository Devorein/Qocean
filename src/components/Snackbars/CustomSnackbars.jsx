import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
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

export default function CustomizedSnackbars({ title, message, severity, isOpen, changeResponse, timing }) {
	const classes = useStyles();

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') return;
		changeResponse(title, message, severity, false);
	};

	return (
		<div className={classes.root}>
			<Snackbar open={isOpen} autoHideDuration={timing} onClose={handleClose}>
				<Alert severity={severity} onClose={handleClose}>
					<AlertTitle>{title}</AlertTitle>
					{message}
				</Alert>
			</Snackbar>
		</div>
	);
}
