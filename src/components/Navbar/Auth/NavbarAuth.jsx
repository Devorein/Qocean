import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class NavbarAuth extends Component {
	render() {
		const { session } = this.props;
		return (
			<div className="NavbarAuth Navbar__item">
				<NavLink className="Navbar-links NavbarAuth__item" to="/" exact>
					Home
				</NavLink>
				<NavLink className="Navbar-links NavbarAuth__item" to="/create">
					Create
				</NavLink>
				<NavLink className="Navbar-links NavbarAuth__item" to="/explore">
					Explore
				</NavLink>
				<NavLink className="Navbar-links NavbarAuth__item" to="/self">
					Self
				</NavLink>
				<NavLink className="Navbar-links NavbarAuth__item" to="/app">
					App
				</NavLink>
			</div>
		);
	}
}

export default NavbarAuth;
