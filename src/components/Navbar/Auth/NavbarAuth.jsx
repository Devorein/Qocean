import React, { Fragment } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { Button, Menu, MenuItem } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

function NavbarAuth({ session, refetch, history }) {
	const logout = () => {
		localStorage.removeItem('token');
		history.push('/');
		refetch();
	};

	const switchPage = (page) => {
		history.push(`/${page}`);
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
			<Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
				<MenuItem onClick={switchPage.bind(null, 'Profile')}>Profile</MenuItem>
				<MenuItem onClick={switchPage.bind(null, 'Stats')}>Stats</MenuItem>
				<MenuItem onClick={logout}>
					<Button variant="contained" size="medium" startIcon={<ExitToAppIcon />} onClick={logout}>
						Logout
					</Button>
				</MenuItem>
			</Menu>
		</Fragment>
	);
}

export default withRouter(NavbarAuth);
