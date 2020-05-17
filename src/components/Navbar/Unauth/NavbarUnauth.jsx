import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class NavbarUnauth extends Component {
	render() {
		return (
			<>
				<NavLink className="navbar-link" to="/" exact>
					Home
				</NavLink>
				<NavLink className="navbar-link" to="/explore">
          Explore
				</NavLink>
				<NavLink className="navbar-link" to="/signin">
          Signin
				</NavLink>
				<NavLink className="navbar-link" to="/signup">
          Signup
				</NavLink>
			</>
		);
	}
}

export default NavbarUnauth;
