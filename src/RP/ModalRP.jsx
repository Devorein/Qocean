import React, { Component, Fragment } from 'react';
import WarnModal from '../components/Modal/WarnModal';

class ModalRP extends Component {
	state = {
		isOpen: false
	};

	handleClose = () => {
		this.setState(
			{
				isOpen: false
			},
			() => (this.props.onClose ? this.props.onClose() : null)
		);
	};

	handleCancel = () => {
		this.setState(
			{
				isOpen: false
			},
			() => (this.props.onCancel ? this.props.onCancel() : null)
		);
	};

	handleAccept = () => {
		this.setState(
			{
				isOpen: false
			},
			() => (this.props.onAccept ? this.props.onAccept() : null)
		);
	};

	setIsOpen = (isOpen) => {
		this.setState({
			isOpen
		});
	};

	render() {
		const { handleClose, handleCancel, handleAccept, setIsOpen } = this;
		const { isOpen } = this.state;
		const { modalMsg } = this.props;

		return (
			<Fragment>
				{this.props.children({
					isOpen,
					handleClose,
					handleCancel,
					handleAccept,
					setIsOpen
				})}
				<WarnModal onClose={handleClose} onAccept={handleAccept} onCancel={handleCancel} isOpen={isOpen}>
					<div>{modalMsg}</div>
				</WarnModal>
			</Fragment>
		);
	}
}

export default ModalRP;
