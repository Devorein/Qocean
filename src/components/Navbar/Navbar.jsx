import React from 'react';

import NavbarAuth from './Auth/NavbarAuth';
import NavbarUnauth from './Unauth/NavbarUnauth';

import './Navbar.scss';

const Navbar = ({ session }) => {
	return (
		<nav className="navbar navbar-links">
			{session && session.data ? <NavbarAuth session={session} /> : <NavbarUnauth />}
		</nav>
	);
};

export default Navbar;
