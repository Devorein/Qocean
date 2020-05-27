import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import CancelIcon from '@material-ui/icons/Cancel';

class WarnModal extends Component {
	render() {
		const { cancelMsg, acceptMsg, isOpen, onAccept, classes, children } = this.props;
		let { onClose, onCancel } = this.props;
		if (!onClose) onClose = onCancel;
		if (!onCancel) onCancel = onClose;

		return (
			<div className="custom_modal">
				<Modal className={classes.modal} open={isOpen} closeAfterTransition>
					<Fade in={isOpen}>
						<DialogContent>
							<CancelIcon onClick={onClose} />
							<div className="modal_content">{children}</div>
							<div>
								<Button onClick={onCancel}>{cancelMsg ? cancelMsg : 'Cancel'}</Button>
								<Button onClick={onAccept}>{acceptMsg ? acceptMsg : 'Accept'}</Button>
							</div>
						</DialogContent>
					</Fade>
				</Modal>
			</div>
		);
	}
}

export default withStyles((theme) => ({
	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	}
}))(WarnModal);