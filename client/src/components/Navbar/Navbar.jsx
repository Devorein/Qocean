import React from 'react';

import NavbarAuth from './Auth/NavbarAuth';
import NavbarUnauth from './Unauth/NavbarUnauth';

import './Navbar.scss';

const Navbar = ({ session, refetch }) => {
	return (
		<nav className="navbar navbar-links">
			{session && session.user ? <NavbarAuth user={session.user} refetch={refetch} /> : <NavbarUnauth />}
		</nav>
	);
};

export default Navbar;
