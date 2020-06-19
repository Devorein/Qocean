import React, { Fragment, Component } from 'react';
import Popover from '@material-ui/core/Popover';
import { withStyles } from '@material-ui/core/styles';

class CustomPopover extends Component {
	state = {
		anchorEl: null
	};

	handlePopoverOpen = (event) => {
		this.setState({ anchorEl: event.currentTarget });
	};

	handlePopoverClose = () => {
		this.setState({ anchorEl: null });
	};

	render() {
		const { anchorEl } = this.state;
		const { text, classes, children } = this.props;
		const open = Boolean(anchorEl);
		return (
			<Fragment>
				{React.cloneElement(children, {
					...children.props,
					onMouseLeave: this.handlePopoverClose,
					onMouseEnter: this.handlePopoverOpen
				})}
				<Popover
					id="mouse-over-popover"
					open={open}
					anchorEl={anchorEl}
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'center'
					}}
					transformOrigin={{
						vertical: 'bottom',
						horizontal: 'center'
					}}
					className={classes.popover}
					classes={{
						paper: classes.paper,
						root: classes.root
					}}
					onClose={this.handlePopoverClose}
					disableRestoreFocus
				>
					{text}
				</Popover>
			</Fragment>
		);
	}
}

export default withStyles((theme) => ({
	root: {
		fontSize: 12
	},
	popover: {
		pointerEvents: 'none'
	},
	paper: {
		padding: theme.spacing(1)
	}
}))(CustomPopover);
