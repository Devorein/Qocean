import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import DialogContent from '@material-ui/core/DialogContent';
import CancelIcon from '@material-ui/icons/Cancel';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

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

	const { isOpen, handleClose, onArrowClick } = props;
	return (
		<div className="custom_modal">
			<Modal className={classes.modal} open={isOpen} closeAfterTransition>
				<Fade in={isOpen}>
					<DialogContent>
						<CancelIcon onClick={handleClose} />
						<ChevronLeftIcon onClick={onArrowClick.bind(null, 'left')} />
						<ChevronRightIcon onClick={onArrowClick.bind(null, 'right')} />
						<div className="modal_content">{props.children}</div>
					</DialogContent>
				</Fade>
			</Modal>
		</div>
	);
}
