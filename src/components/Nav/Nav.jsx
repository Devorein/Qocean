import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Nav.scss';

class Nav extends Component {
	render() {
		return (
			<div className="Nav nav-links">
				<Link to="/create">
					<li className="nav-link">Create</li>
				</Link>
				<Link to="/explore">
					<li className="nav-link">Explore</li>
				</Link>
				<Link to="/self">
					<li className="nav-link">Self</li>
				</Link>
			</div>
		);
	}
}

export default Nav;
