import React, { Component } from 'react';
import { NavLink,withRouter } from 'react-router-dom';
import { Button } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

class NavbarAuth extends Component {
  logout = () =>{
    const {refetch} = this.props;
    localStorage.removeItem('token');
    this.props.history.push("/");
    refetch();
  }
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
        <NavLink className="navbar-link" to="/profile">
        Profile
				</NavLink>
        <Button variant="contained" size="medium" startIcon={<ExitToAppIcon />} onClick={this.logout}>Logout</Button>
			</>
		);
	}
}

export default withRouter(NavbarAuth);
