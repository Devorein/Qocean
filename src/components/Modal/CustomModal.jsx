import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import DialogContent from '@material-ui/core/DialogContent';

import Icon from '../../components/Icon/Icon';

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
						<Icon icon="cancel" onClick={handleClose} popoverText="Close Modal" />

						{onArrowClick ? (
							<Icon icon="chevronleft" onClick={onArrowClick.bind(null, 'left')} popoverText="Go to prev item" />
						) : null}
						{onArrowClick ? (
							<Icon icon="chevronright" onClick={onArrowClick.bind(null, 'right')} popoverText="Go to next item" />
						) : null}
						<div className="modal_content">{props.children}</div>
					</DialogContent>
				</Fade>
			</Modal>
		</div>
	);
}
