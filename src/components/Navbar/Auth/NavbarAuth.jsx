import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class NavbarAuth extends Component {
	render() {
		const { session } = this.props;
		return (
			<>
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
			</>
		);
	}
}

export default NavbarAuth;
