import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Nav extends Component {
	render() {
		return (
			<div className="Nav page">
				<nav>
					<ul>
						<Link to="/create">
							<li>Create</li>
						</Link>
						<Link to="/explore">
							<li>Explore</li>
						</Link>
						<Link to="/self">
							<li>Self</li>
						</Link>
					</ul>
				</nav>
			</div>
		);
	}
}

export default Nav;
