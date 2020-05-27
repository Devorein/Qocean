import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import DialogContent from '@material-ui/core/DialogContent';

const useStyles = makeStyles((theme) => ({
	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	},
	paper: {
		backgroundColor: theme.palette.background.paper,
		border: '2px solid #000',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3)
	}
}));

export default function CustomModal(props) {
	const classes = useStyles();

	const { isOpen, handleClose } = props;
	return (
		<div className="custom_modal">
			<Modal className={classes.modal} open={isOpen} onClose={handleClose} closeAfterTransition>
				<DialogContent>{props.children}</DialogContent>
			</Modal>
		</div>
	);
}
