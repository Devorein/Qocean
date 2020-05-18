import React, { Fragment } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { Button, Menu, MenuItem } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { orange } from '@material-ui/core/colors';

const useStyles = makeStyles({
	paper: {
		backgroundColor: '#1a1a1a',
		color: 'rgba(255, 255, 255, 0.87)',
		'& .MuiMenuItem-root': {
			display: 'flex',
			justifyContent: 'center',
			fontFamily: 'Quantico',
			'&:hover': {
				backgroundColor: '#333'
			}
		}
	}
});

const CustomButtom = withStyles((theme) => ({
	root: {
		fontFamily: 'Quantico',
		fontWeight: 'bold',
		color: '#ddd',
		backgroundColor: '#1a1a1a',
		'&:hover': {
			backgroundColor: orange[500]
		}
	}
}))(Button);

function NavbarAuth({ session, refetch, history }) {
	const { paper } = useStyles();

	const logout = () => {
		localStorage.removeItem('token');
		history.push('/');
		refetch();
	};

	const switchPage = (page) => {
		history.push(`/${page}`);
		setAnchorEl(null);
	};

	const [ anchorEl, setAnchorEl ] = React.useState(null);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<Fragment>
			<NavLink className="navbar-link" to="/" exact>
				Home
			</NavLink>
			<NavLink className="navbar-link" to="/create">
				Create
			</NavLink>
			<NavLink className="navbar-link" to="/explore">
				Explore
			</NavLink>
			<NavLink className="navbar-link" to="/self">
				Self
			</NavLink>
			<NavLink className="navbar-link" to="/app">
				Play
			</NavLink>
			<div className="navbar-link">
				<img
					className="navbar-link-item navbar-link-item--image"
					src={
						session.data.data.image ? (
							session.data.data.image
						) : (
							'https://lh3.googleusercontent.com/proxy/mdVWZ0Fj0Te7HknqmLlP-GuXvPDpFRagnNO7rNTy9FZbWLudq42SmIetnNQNG38XUfUqxyKdCNrUBNpc69mDB4BYa5XrWdV6KZvfeCKlzN5oEXw'
						)
					}
					alt={'User'}
				/>
				<span className="navbar-link-item navbar-link-item--username" onClick={handleClick}>
					{session.data.data.username}
				</span>
			</div>
			<Menu
				id="simple-menu"
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center'
				}}
				getContentAnchorEl={null}
				classes={{ paper }}
			>
				<MenuItem onClick={switchPage.bind(null, 'profile')}>
					<AccountBoxIcon />
					Profile
				</MenuItem>
				<MenuItem onClick={switchPage.bind(null, 'stats')}>
					<EqualizerIcon />
					Stats
				</MenuItem>
				<MenuItem onClick={logout}>
					<CustomButtom variant="contained" size="large" startIcon={<ExitToAppIcon />}>
						Logout
					</CustomButtom>
				</MenuItem>
			</Menu>
		</Fragment>
	);
}

export default withRouter(NavbarAuth);
