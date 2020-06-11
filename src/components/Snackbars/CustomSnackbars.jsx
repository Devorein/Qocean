import React, { Fragment } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import { withStyles } from '@material-ui/core/styles';
import { AppContext } from '../../context/AppContext';

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class CustomizedSnackbars extends React.Component {
	static contextType = AppContext;

	state = {
		response: {
			severity: null,
			message: null,
			title: null,
			isOpen: false
		}
	};

	changeResponse = (title, message, severity, isOpen = true) => {
		this.setState({
			response: {
				title,
				message,
				severity,
				isOpen
			}
		});
	};

	handleClose = (event, reason) => {
		const { title, message, severity } = this.state.response;
		if (reason === 'clickaway') return;
		this.changeResponse(title, message, severity, false);
	};

	render() {
		const { classes } = this.props;
		const timing = this.context.user ? this.context.user.current_environment.notification_timing : 2500;
		const { title, message, severity, isOpen } = this.state.response;
		return (
			<Fragment>
				{this.props.children({
					changeResponse: this.changeResponse
				})}
				<Snackbar className={classes.root} open={isOpen} autoHideDuration={timing} onClose={this.handleClose}>
					<Alert severity={severity} onClose={this.handleClose}>
						<AlertTitle>{title}</AlertTitle>
						{message}
					</Alert>
				</Snackbar>
			</Fragment>
		);
	}
}

export default withStyles((theme) => ({
	root: {
		width: '100%',
		'& > * + *': {
			marginTop: theme.spacing(2)
		}
	}
}))(CustomizedSnackbars);
