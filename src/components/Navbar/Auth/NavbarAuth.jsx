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
							'https://www.teknozeka.com/wp-content/uploads/2020/03/wp-header-logo-24.png'
						)
					}
					alt={'User'}
				/>
				<span className="navbar-link-item navbar-link-item--username" onClick={handleClick}>
					{session.data.data.username}
				</span>
			</div>
			<Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
				<MenuItem onClick={handleClose}>Profile</MenuItem>
				<MenuItem onClick={handleClose}>Stats</MenuItem>
				<MenuItem onClick={handleClose}>Logout</MenuItem>
			</Menu>

			{/* <NavLink className="navbar-link" to="/profile">
				Profile
			</NavLink>
			<Button variant="contained" size="medium" startIcon={<ExitToAppIcon />} onClick={logout}>
				Logout
			</Button> */}
		</Fragment>
	);
}

export default withRouter(NavbarAuth);
